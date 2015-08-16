'use strict';


/**
 * Right rules embeded into right document
 */
exports = module.exports = function(params) {
	
	var mongoose = params.mongoose;
    
    var ruleTypes = [
        'entry_date',       // right is visible when the entry date is in the interval
                            // min in days before the renewal start date
                            // max in days after the renewal end date

        'request_date',     // right is visible when request begin date >= computed min date
                            // and request end date <= computed max date
                            // min in days before the renewal start date
                            // max in days after the renewal end date

        'seniority'         // Right si visible if the user account seniority date
                            // is in the interval, min and max are in years before
                            // the entry date
    ];

	
	var rightRuleSchema = new mongoose.Schema({
        
        right: { type: mongoose.Schema.Types.ObjectId, ref: 'Right', required: true },
        
        // title displayed to the user as a condition
        // to apply this vacation right
		title: { type: String, required: true },

        type: { type: String, enum: ruleTypes, required: true },
        
        interval: {
            min: { type: Number, default: 0 }, // number of days or number of years
            max: { type: Number, default: 0 }  // number of days or number of years
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
		
        var Gettext = require('node-gettext');
        var gt = new Gettext();
		var rule = this;
        
        if (undefined === rule.interval || (undefined === rule.interval.min && undefined === rule.interval.max)) {
            next(new Error('At least one value must be set in interval to save the rule'));
            return;
        }
        
        var min = (undefined === rule.interval.min) ? null : rule.interval.min;
        var max = (undefined === rule.interval.max) ? null : rule.interval.max;
        
        
		
		switch(rule.type) {
            case 'seniority':
                if (isNaN(min) || isNaN(max)) {
                    next(new Error(gt.gettext('Interval values must be numbers of years')));
                    return;
                }

                if (min < max) {
                    next(new Error(gt.gettext('Interval values must be set in a correct order')));
                    return;
                }
                
            break;
            
            case 'entry_date':
            case 'request_date':
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

        start.setDate(start.getDate() - this.interval.min);
        finish.setDate(finish.getDate() + this.interval.max);

        return {
            dtstart: start,
            dtend: finish
        };
    };



    /**
     * Validate right rule
     *
     * @param {Request}      request    Request document with populated user.id field
     * @param {RightRenewal} renewal    Right renewal
     * @return {boolean}
     */
    rightRuleSchema.methods.validate = function(request, renewal) {

        if (undefined === request.populated('user.id')) {
            throw new Error('The user.id field need to be populated');
        }

        switch(this.type) {
            case 'seniority':       return this.validateSeniority(request.timeCreated, request.user.id);
            case 'entry_date':      return this.validateEntryDate(request.timeCreated, renewal);
            case 'request_date':    return this.validateRequestDate(request.events, renewal);
        }

        return false;
    };


    /**
     * test validity from the seniority date
     * the seniority date is the previsional retirment date
     * @param {Date}            timeCreated        request creation date
     * @param {User}            user
     *
     * @return {boolean}
     */
    rightRuleSchema.methods.validateSeniority = function(timeCreated, user) {

        if (undefined === user.populated('roles.account')) {
            throw new Error('The roles.account field need to be populated');
        }

        var seniority = user.roles.account.seniority;

        if (undefined === seniority || null === seniority) {
            return false;
        }

        var min = new Date(timeCreated);
        var max = new Date(timeCreated);

        min.setFullYear(min.getFullYear() - this.interval.min);
        max.setFullYear(max.getFullYear() - this.interval.max);

        if (min <= timeCreated && max >= timeCreated) {
            return true;
        }

        return false;
    };



    /**
     * @return {boolean}
     */
    rightRuleSchema.methods.validateEntryDate = function(timeCreated, renewal) {
        return false;
    };

    /**
     * @return {boolean}
     */
    rightRuleSchema.methods.validateRequestDate = function(events, renewal) {
        return false;
    };


    rightRuleSchema.set('autoIndex', params.autoIndex);

	params.embeddedSchemas.RightRule = rightRuleSchema;
};


