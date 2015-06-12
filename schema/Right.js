'use strict';

exports = module.exports = function(params) {
    
    var mongoose = params.mongoose;
    
	var rightSchema = new params.mongoose.Schema({
		name: { type: String, unique: true },
        description: String,
		timeCreated: { type: Date, default: Date.now },
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' },
        require_approval: { type: Boolean, default:true },
        sortkey: Number,
        
        // automatic distribution on this right on request creation
        autoDistribution: { type: Boolean, default:true },
        
        quantity: { type: Number, min:0 },
        quantity_unit: { type: String, enum:['D', 'H'] },
        
        increment: {
            monthQuantity: { type: Number, min:0 },
            max: { type: Number, min:0 },
            last: Date
        },
        
        activeFor: {
            account: { type: Boolean, default:true },
            
            // manager substituting one of his subordinate
            manager: { type: Boolean, default:true },
            
            // admin substituting one of the user with vacation account
            admin: { type: Boolean, default:true }
        },
        
        // activeSpan.min minimal number of days between entry date and request start date
        // this is the time given to the approvers
        // activeSpan.max maximal number of days between entry date and request end date
        // by default, the parameter is set globally
        activeSpan: {
            useDefault: { type: Boolean, default:true },
            min: Number,
            max: Number
        }
	});
    
    
    rightSchema.index({ 'name': 1 }, { unique: true });
	rightSchema.set('autoIndex', params.autoIndex);

    
    /**
     * Find right renewals
     * @returns {Query} A mongoose query on the right renewal schema
     */
    rightSchema.methods.getRenewalsQuery = function() {
        return this.model('RightRenewal')
            .find()
            .where('right').equals(this._id);
    };
    

    /**
     * Get renewal by date interval or null if no renewal
     * @param {Date} dtstart
     * @param {Date} dtend
     * @returns {Promise} q
     */
    rightSchema.methods.getPeriodRenewal = function(dtstart, dtend) {
        
        var Q = require('q');
        var deferred = Q.defer();
        
        this.getRenewalsQuery()
            .where('start').lte(dtstart)
            .where('finish').gte(dtend)
            .exec(function(err, arr) {
            
                if (err) {
                    deferred.reject(err);
                    return;
                }
            
                if (!arr || 0 === arr.length) {
                    deferred.resolve(null);
                    return;   
                }
            
                deferred.resolve(arr[0]);
            });
        
        return deferred.promise;
    };
    


    /**
     * Get current renewal or null if no renewal
     * @returns {Promise} q
     */
    rightSchema.methods.getCurrentRenewal = function() {
        return this.getPeriodRenewal(new Date(), new Date());
    };


    /**
     * Get last renewal
     * @returns {Promise} q
     */
    rightSchema.methods.getLastRenewal = function() {
        
        var Q = require('q');
        var deferred = Q.defer();
        
        this.getRenewalsQuery()
            .limit(1)
            .sort('-start')
            .exec(function(err, arr) {
            
                if (err) {
                    deferred.reject(err);
                    return;
                }
            
                if (!arr || 0 === arr.length) {
                    deferred.resolve(null);
                    return;
                }
            
                deferred.resolve(arr[0]);
            });
        
        return deferred.promise;
    };
    
    
    rightSchema.methods.getDispUnit = function(quantity) {
        
        if (undefined === quantity || null === quantity) {
            quantity = 10;
        }
        
        var Gettext = require('node-gettext');
        var gt = new Gettext();
        
        switch(this.quantity_unit) {
            case 'D':
                return gt.ngettext('Day', 'Days', quantity);
            case 'H':
                return gt.ngettext('Hour', 'Hours', quantity);
        }
    };

    
    
	
	params.db.model('Right', rightSchema);
};





