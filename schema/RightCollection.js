'use strict';

exports = module.exports = function(params) {
    var collectionSchema = new params.mongoose.Schema({
        name: { type: String, required: true, unique: true  },
        timeCreated: { type: Date, default: Date.now },
        attendance: { type: Number, min: 0, max: 100, default: 100 },   // attendance percentage
                                                                        // vacation right consuption will be recorded according to this percentage
                                                                        // only if consuption=proportion (right property)
                                                                        // ex: for one day of absence,
                                                                        // the consumed quantity will be 0.5 day if the attendance is 50%

        businessDays: {                                                 // list of business days for the department
            SU: { type: Boolean, default: false },                      // they will be used to set the consumed quantity  for
            MO: { type: Boolean, default: true },                       // the part-times users
            TU: { type: Boolean, default: true },                       // only if consuption=businessDays (right property)
            WE: { type: Boolean, default: true },                       // FR: jours ouvrables
            TH: { type: Boolean, default: true },
            FR: { type: Boolean, default: true },
            SA: { type: Boolean, default: true }
        }
    });
  
    collectionSchema.set('autoIndex', params.autoIndex);
  
    collectionSchema.index({ name: 1 });
    
    

    /**
     * Get the list of business days in an array according to Date.getDay format
     * 0 = sunday
     * 1 = monday
     *
     * @return {Array}
     */
    collectionSchema.methods.getDays = function() {

        let days = [];
        let d = 0;
        let businessDays = this.businessDays.toObject();
        for (var abbr in businessDays) {
            if (businessDays.hasOwnProperty(abbr)) {
                if (businessDays[abbr]) {
                    days.push(d);
                }

                d++;
            }
        }

        return days;
    };


    /**
     * Get the list of rights in collection
     * @return {Promise} resolve to an array of beneficiaries
     */
    collectionSchema.methods.getRights = function getRights() {
        
        var find = this.model('Beneficiary').find()
            .where('ref').equals('RightCollection')
            .where('document').equals(this._id)
            .populate('right');


        return find.exec();
    };
    
    /**
     * Get the list of users with collection
     * @param {Date}    moment  Optional date for collection association to users
     * @return {Promise} resolve to an array of users
     */
    collectionSchema.methods.getUsers = function getUsers(moment) {
        
        var deferred = {};
        deferred.promise = new Promise(function(resolve, reject) {
            deferred.resolve = resolve;
            deferred.reject = reject;
        });
        
        if (null === moment) {
            moment = new Date();
            moment.setHours(0,0,0,0);
        }
        
        this.model('AccountCollection').find()
            .where('from').lte(moment)
            .where('to').gte(moment)
            .populate('account.user.id.roles.account')
            .exec(function(err, arr) {
            
                if (err) {
                    deferred.reject(err); return;
                }
            
                var users = [];
                for(var i=0; i<arr.length; i++) {
                    users.push(arr[i].user.id);
                }

                deferred.resolve(users);
            });
        
        return deferred.promise;
    };
    


    
    /**
     * initialize default collections
     */  
    collectionSchema.statics.createFrenchDefaults = function(done) {
		
		
		var model = this;
        var async = require('async');
        var gt = require('./../modules/gettext');
		
		async.each([
            { name: gt.gettext('General regime 100%'), attendance: 100 },
            { name: gt.gettext('Part-time 80%'), attendance: 80 },
            { name: gt.gettext('Part-time 50%'), attendance: 50 }
        ], function( type, callback) {
            
          model.create(type, function(err) {
              if (err) {
                  callback(err);
                  return;
              }
              
              callback();
          });
        }, function(err){
            // if any of the file processing produced an error, err would equal that error
            if(err) {
                console.trace(err);
                return;
            }
            
            if (done) {
                done();
            }
        });
    };
    
  
    params.db.model('RightCollection', collectionSchema);
};

