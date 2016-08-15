'use strict';

const gt = require('./../../../../modules/gettext');


exports = module.exports = function(services, app) {

    var service = new services.delete(app);

    /**
     * Call the rightrenewal delete service
     *
     * @param {object} params
     * @return {Promise}
     */
    service.getResultPromise = function(params) {



        service.app.db.models.RightRenewal.findById(params.id)
        .then(document => {

            return service.get(params.id)
            .then(object => {

                return document.remove()
                .then(() => {
                    service.resolveSuccess(object, gt.gettext('The renewal has been deleted'));
                });
            });
            
        })
        .catch(service.error);

        return service.deferred.promise;
    };


    return service;
};
