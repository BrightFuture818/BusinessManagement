'use strict';



exports = module.exports = function(services, app) {
    
    var service = new services.get(app);
    
    /**
     * Call the users get service
     * 
     * @param {Object} params
     * @return {Promise}
     */
    service.call = function(params) {
        
        console.log(params);
        
        service.models.User
        .findOne({ '_id' : params.id }, 'lastname firstname email isActive department roles')
        .populate('department')
        .populate('roles.account')
        .populate('roles.admin')
        .populate('roles.manager')
        .exec(function(err, user) {
            if (service.handleMongoError(err))
            {
                if (user) {
                    
                    require('../../../../modules/useraccount')(user).then(function(userObj) {
                        service.outcome.success = true;
                        service.deferred.resolve(userObj);
                    });
                    
                    
                } else {
                    service.notFound(service.gt.gettext('This user does not exists'));
                }
            }
        });
        
        return service.deferred.promise;
    };
    
    
    return service;
};


