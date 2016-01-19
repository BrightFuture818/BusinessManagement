


/**
 * The personal events list service
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

    if (undefined === params.status) {
        params.status = ['TENTATIVE', 'CONFIRMED'];
    }

    find.where('user.id').equals(params.user);

    find.where('status').in(params.status);

    var periodCriterion = require('../../../../modules/periodcriterion');
    periodCriterion(find, params.dtstart, params.dtend);


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

            if (err) {
                return service.error(err);
            }

            var objects = docs.map(function(event) {
                event = event.toObject();
                if (undefined === event.uid || null === event.uid || '' === event.uid) {
                    event.uid = event._id;
                }

                return event;
            });

            return service.mongOutcome(err, objects);


        });


        return service.deferred.promise;
    };


    return service;
};




