


/**
 * The calendar events list service
 */




/**
 * Get regular event by applying the date filter
 * And rrule events by calling the expand on the events
 *
 * @param {listItemsService} service
 * @param {array} params      query parameters if called by controller
 *
 * @return {Query}
 */
function getEventsQuery(service, params)
{
    'use strict';

    var find = service.app.db.models.CalendarEvent.find();

    if (undefined === params.user) {
        throw new Error('The user parameter is mandatory in the personalevents service');
    }

    find.where('user.id').equals(params.user);


    find.or([
        { rrule: { $exists: true } },
        { $and:
            [
                { rrule: { $exists: false } },
                { dtend: { $gt: params.dtstart } },
                { dtstart: { $lt: params.dtend } }
            ]
        }
    ]);

    find.populate('absenceElem');
    find.populate('request');

    return find;
}







/**
 * Create the service
 * @param   {Object} services
 * @param   {Object} app
 * @returns {listItemsService}
 */
exports = module.exports = function(services, app) {

    'use strict';

    var service = new services.list(app);

    /**
     * Call the personal events list service
     *
     *
     * @param {Object} params
     *                      params.dtstart                  search interval start
     *                      params.dtend                    serach interval end
     *                      params.user                     user ID to search in
     *
     * @return {Promise}
     */
    service.getResultPromise = function(params) {

        var checkParams = require('../../../../modules/requestdateparams');

        if (!checkParams(service, params)) {
            return service.deferred.promise;
        }

        getEventsQuery(service, params).exec(function(err, docs) {


            return service.mongOutcome(err, docs);


        });


        return service.deferred.promise;
    };


    return service;
};




