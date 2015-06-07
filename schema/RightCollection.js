'use strict';

exports = module.exports = function(params) {
    var collectionSchema = new params.mongoose.Schema({
        name: { type: String, required: true, unique: true  },
        timeCreated: { type: Date, default: Date.now },
        attendance: { type: Number, min: 0, max: 100, default: 100 }
    });
  
    collectionSchema.set('autoIndex', params.autoIndex);
  
    collectionSchema.index({ name: 1 });
    
    
    /**
     * Get the list of rights in collection
     * @return {Promise} resolve to an array
     */
    collectionSchema.methods.getRights = function() {
        
        return this.model('Beneficiary').find()
            .where('ref').is('RightCollection')
            .where('document').is(this._id)
            .populate('right')
            .exec();
    };
    
    /**
     * Get the list of users with collection
     * @param {Date}    moment  Optional date for collection association to users
     * @return {Promise} resolve to an array of users
     */
    collectionSchema.methods.getUsers = function(moment) {
        
        var deferred = require('q').defer();
        
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
     * Get the consumed quantity to store in absence request
     * according to the attendance percentage
     * @param {Number} periodQuantity
     * @return {Number}
     */
    collectionSchema.methods.getConsumedQuantity = function(periodQuantity)
    {

        if (100 === this.attendance || undefined === this.attendance) {
            return periodQuantity;
        }

        // 50% -> x2
        // 75% -> x1.333
        // 25% -> x4
        // 100% -> x1

        var m = 100*(1/this.attendance);

        return (m*periodQuantity);
    }

    
    /**
     * initialize default collections
     */  
    collectionSchema.statics.createFrenchDefaults = function(done) {
		
		
		var model = this;
        var async = require('async');
        var Gettext = require('node-gettext');
        var gt = new Gettext();
		
		async.each([
            { name: gt.gettext('General regime 100%') },
            { name: gt.gettext('Part-time 80%') },
            { name: gt.gettext('Part-time 50%') }
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
                console.log(err);
                return;
            }
            
            if (done) {
                done();
            }
        });
    };
    
  
    params.db.model('RightCollection', collectionSchema);
};

