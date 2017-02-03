'use strict';

const consuptionHistory = require('../modules/consuptionHistory');

/**
 * Right rules embeded into right document
 */
exports = module.exports = function(params) {

	const mongoose = params.mongoose;

    const ruleTypes = [
        'entry_date',       // right is visible when the entry date is in the interval
                            // min in days before the renewal start date
                            // max in days after the renewal end date

        'request_period',   // right is visible when request begin date >= computed min date
                            // and request end date <= computed max date
                            // min in days before the renewal start date
                            // max in days after the renewal end date

        'seniority',        // Right si visible if the user account seniority date
                            // is in the interval, min and max are in years before
                            // the entry date

        'age',              // Right is visible if the user age is in the interval
                            // min and max are in years after the birth date

		'consuption'		// Right is visible if the user have consumed between
							// min and max quantity on the specified right type
							// interval.unit can be H or D
							// rights from consuption.type not in the same unit will
							// ignored
							// The interval consuption.dtstart <=> consuption.dtend
							// is computed with the specified month and day and the year
							// of the current request.timeCreated
    ];


	var rightRuleSchema = new mongoose.Schema({

        // title displayed to the user as a condition
        // to apply this vacation right
		title: { type: String, required: true },

        type: { type: String, enum: ruleTypes, required: true },

        interval: {
            min: { type: Number, default: 0 }, // number of days or number of years
            max: { type: Number, default: 0 }, // number of days or number of years
            unit: { type: String, enum: ['H', 'D', 'Y'], default: 'D' }
        },

		consuption: {
			dtstart: Date,	// The year is ignored
			dtend: Date,	// The year is ignored
			type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' }
		},

        timeCreated: { type: Date, default: Date.now },
        lastUpdate: { type: Date, default: Date.now }
	});





    /**
     * Ensure that the interval is valid for the selected rule type
     * interval must have one value set
     * if the two values are set min must be < max
     */
    rightRuleSchema.pre('save', function (next) {

		const gt = params.app.utility.gettext;

		let rule = this;

        if (undefined === rule.interval || (undefined === rule.interval.min && undefined === rule.interval.max)) {
            next(new Error('At least one value must be set in interval to save the rule'));
            return;
        }

        let min = (undefined === rule.interval.min) ? null : rule.interval.min;
        let max = (undefined === rule.interval.max) ? null : rule.interval.max;



		switch(rule.type) {

            case 'age':
            case 'seniority':
                if (isNaN(min) || isNaN(max)) {
                    next(new Error(gt.gettext('Interval values must be numbers of years')));
                    return;
                }

                if (('seniority' === rule.type && min < max) || ('age' === rule.type && min > max)) {
                    next(new Error(gt.gettext('Interval values must be set in a correct order')));
                    return;
                }

            break;

            case 'entry_date':
            case 'request_period':
                // no possible verification

            break;
        }




        next();

	});


    /**
     * Get dates interval from renewal
     * @return {Object}
     */
    rightRuleSchema.methods.getInterval = function(renewal) {
        var start = new Date(renewal.start);
        var finish = new Date(renewal.finish);

        if (undefined === this.interval.unit) {
            throw new Error('The interval unit is mandatory');
        }

        if ('D' === this.interval.unit) {
            start.setDate(start.getDate() - this.interval.min);
            finish.setDate(finish.getDate() + this.interval.max);
        }

        if ('Y' === this.interval.unit) {
            start.setFullYear(start.getFullYear() - this.interval.min);
            finish.setFullYear(finish.getFullYear() + this.interval.max);
        }

        return {
            dtstart: start,
            dtend: finish
        };
    };



    /**
     * Validate right rule
     * return false if the rule is not appliquable (ex: for request date when the request does not exists)
     *
     * @param {RightRenewal} renewal      Right renewal
     * @param {User}         user         Request appliquant
     * @param {Date}         dtstart        Request start date
     * @param {Date}         dtend          Request end date
     * @param {Date}         [timeCreated]  Request creation date
     * @return {Promise}	 Resolve to a boolean
     */
    rightRuleSchema.methods.validateRule = function(renewal, user, dtstart, dtend, timeCreated) {

		let rule = this;

        switch(rule.type) {
            case 'seniority':       return Promise.resolve(rule.validateSeniority(dtstart, dtend, user));
            case 'entry_date':      return Promise.resolve(rule.validateEntryDate(timeCreated, renewal));
            case 'request_period':  return Promise.resolve(rule.validateRequestDate(dtstart, dtend, renewal));
            case 'age':             return Promise.resolve(rule.validateAge(dtstart, dtend, user));
			case 'consuption':		return rule.validateConsuption(timeCreated, user);
        }

        return Promise.resolve(false);
    };


	/**
	 * Test validity for consuption
	 *
	 * @param {Date} moment		The moment of the request
	 * @param {User} user		The appliquant
	 *
	 * @returns {Promise}  resolve to a boolean
	 */
	rightRuleSchema.methods.validateConsuption = function(moment, user) {

		let rule = this;

		let dtstart = new Date(rule.consuption.dtstart);
		dtstart.setFullYear(moment.getFullYear());

		let dtend = new Date(rule.consuption.dtend);
		dtend.setFullYear(moment.getFullYear());

		return consuptionHistory.getConsumedQuantityBetween(user, [rule.consuption.type], dtstart, dtend, rule.interval.unit)
		.then(quantity => {
			if (quantity < rule.interval.min || quantity > rule.interval.max) {
				return false;
			}

			return true;
		});
	};



    /**
     * Create interval from one date
     * @throws {Error} 				If the interval unit is not year
     * @param   {Date} d          	reference date, ex birth date
     * @param   {String} operator   operator to use on date year
     * @returns {Array} 			min and max
     */
    rightRuleSchema.methods.getIntervalFromDate = function(d, operator) {

        let operators = {
            '+': function(a, b) { return a + b; },
            '-': function(a, b) { return a - b; }
        };

        let min, max;

        min = new Date(d);
        max = new Date(d);

        if ('Y' !== this.interval.unit) {
            throw new Error('The interval unit for this rule must be year');
        }

        let applyBoundary = operators[operator];

        min.setFullYear(applyBoundary(min.getFullYear(), this.interval.min));
        max.setFullYear(applyBoundary(max.getFullYear(), this.interval.max));

        return {
            min:min,
            max:max
        };
    };




    /**
     * test validity from the birth date
     *
     * @param {Date} dtstart        Request start date
     * @param {Date} dtend          Request end date
     * @param {User} user
     *
     * @return {boolean}
     */
    rightRuleSchema.methods.validateAge = function(dtstart, dtend, user) {

        if (undefined === user.populated('roles.account')) {
            throw new Error('The roles.account field need to be populated');
        }

        if (undefined === dtstart || null === dtstart) {
            return false;
        }

        let birth = user.roles.account.birth;

        if (undefined === birth || null === birth) {
            return false;
        }


        let i = this.getIntervalFromDate(birth, '+');



        if (dtstart < i.min || dtend > i.max) {
            return false;
        }


        return true;
    };










    /**
     * test validity from the seniority date
     * the seniority date is the previsional retirment date
     * @param {Date} dtstart        Request start date
     * @param {Date} dtend          Request end date
     * @param {User} user
     *
     * @return {boolean}
     */
    rightRuleSchema.methods.validateSeniority = function(dtstart, dtend, user) {

        if (undefined === user.populated('roles.account')) {
            throw new Error('The roles.account field need to be populated');
        }

        if (undefined === dtstart || null === dtstart) {
            return false;
        }

        var seniority = user.roles.account.seniority;

        if (undefined === seniority || null === seniority) {
            return false;
        }



        let i = this.getIntervalFromDate(seniority, '-');

        if (dtstart < i.min || dtend > i.max) {
            return false;
        }


        return true;
    };



    /**
     * Test validity from the request creation date
     * @param {Date}            timeCreated
     * @param {RightRenewal}    renewal
     * @return {boolean}
     */
    rightRuleSchema.methods.validateEntryDate = function(timeCreated, renewal) {
        var interval = this.getInterval(renewal);

        if (timeCreated >= interval.dtstart && timeCreated <= interval.dtend) {
            return true;
        }

        return false;
    };

    /**
     * Test validity of all events in a request
     * @param {Date}         dtstart        Request start date
     * @param {Date}         dtend          Request end date
     * @param {RightRenewal} renewal
     * @return {boolean}
     */
    rightRuleSchema.methods.validateRequestDate = function(dtstart, dtend, renewal) {

        if (!dtstart||!dtend) {
            return false;
        }

        var interval = this.getInterval(renewal);

        if (dtstart < interval.dtstart || dtend > interval.dtend) {
            return false;
        }

        return true;
    };


    rightRuleSchema.set('autoIndex', params.autoIndex);

	params.embeddedSchemas.RightRule = rightRuleSchema;
};
