'use strict';


exports = module.exports = function(services, app) {
    
    var service = new services.delete(app);
    
    /**
     * Call the departments delete service
     * 
     * @param {int} id      Document mongoose ID
     * @return {Promise}
     */
    service.call = function(id) {
        
        
        service.models.Department.findById(id, function (err, document) {
            if (service.handleMongoError(err)) {
                document.remove(function(err) {
                    if (service.handleMongoError(err)) {
                        service.success(service.gt.gettext('The department has been deleted'));
                        
                        var department = document.toObject();
                        department.$outcome = service.outcome;
                        
                        service.deferred.resolve(department);
                    }
                });
            }
        });
        
        return service.deferred.promise;
    };
    
    
    return service;
};

