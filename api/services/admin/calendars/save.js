'use strict';



/**
 * Validate params fields
 * @param {apiService} service
 * @param {Object} params
 */
function validate(service, params) {

    if (service.needRequiredFields(params, ['name'])) {
        return;
    }

    saveCalendar(service, params);
}
    
    
/**
 * Update/create the calendar document
 * 
 * @param {apiService} service
 * @param {Object} params
 */  
function saveCalendar(service, params) {

    var Gettext = require('node-gettext');
    var gt = new Gettext();

    
    var CalendarModel = service.app.db.models.Calendar;
    
    
    var fieldsToSet = { 
        name: params.name, 
        url: params.url,
        type: params.type,
        halfDayHour: params.midDayHour,
        lastUpdate: new Date()  
    };
    
    
    function downloadEvents(calendar, message)
    {
        calendar.downloadEvents().then(function() {
            service.resolveSuccess(
                calendar,
                message
            );
        }).fail(function(err) {

            service.forbidden(err);
        });

    }
    

    if (params.id)
    {
        CalendarModel.findByIdAndUpdate(params.id, fieldsToSet, function(err, calendar) {
            if (service.handleMongoError(err)) {
                downloadEvents(calendar, gt.gettext('The calendar has been modified'));
            }
        });

    } else {

        CalendarModel.create(fieldsToSet, function(err, calendar) {

            if (service.handleMongoError(err)) {
                downloadEvents(calendar, gt.gettext('The calendar has been created'));
            }
        });
    }
}
    
    

    
    
    
    



/**
 * Construct the calendar save service
 * @param   {object}          services list of base classes from apiService
 * @param   {express|object}  app      express or headless app
 * @returns {saveItemService}
 */
exports = module.exports = function(services, app) {
    
    var service = new services.save(app);
    
    /**
     * Call the calendar save service
     * 
     * @param {Object} params
     *
     * @return {Promise}
     */
    service.getResultPromise = function(params) {
        validate(service, params);
        return service.deferred.promise;
    };
    
    
    return service;
};


