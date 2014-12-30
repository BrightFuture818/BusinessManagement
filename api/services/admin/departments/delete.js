'use strict';


exports = module.exports = function(services, app) {
    
    var Gettext = require('node-gettext');
    var gt = new Gettext();


    var service = new services.delete(app);
    
    /**
     * Call the departments delete service
     * 
     * @param {object} params
     * @return {Promise}
     */
    service.getResultPromise = function(params) {
        
        
        service.app.db.models.Department.findById(params.id, function (err, document) {
            if (service.handleMongoError(err)) {
                document.remove(function(err) {
                    if (service.handleMongoError(err)) {
                        service.success(gt.gettext('The department has been deleted'));
                        
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

