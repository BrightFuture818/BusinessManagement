'use strict';


exports = module.exports = function(services, app) {
    
    var service = new services.get(app);
    
    /**
     * Call the right renewal get service
     * 
     * @param {Object} params
     * @return {Promise}
     */
    service.getResultPromise = function(params) {
        
        var Gettext = require('node-gettext');
        var gt = new Gettext();


        service.app.db.models.RightRenewal
        .findOne({ '_id' : params.id}, 'right start finish')
        .exec(function(err, document) {
            if (service.handleMongoError(err))
            {
                if (document) {
                    service.outcome.success = true;
                    service.deferred.resolve();
                } else {
                    service.notFound(gt.gettext('This right renewal periods does not exists'));
                }
            }
        });
        
        return service.deferred.promise;
    };
    
    
    return service;
};


