'use strict';



/**
 * Validate params fields
 * @param {apiService} service
 * @param {Object} params
 */
function validate(service, params)
{

    if (service.needRequiredFields(params, ['user'])) {
        return;
    }

    saveRequest(service, params);
}


/**
 * This function will create or update an event
 *
 * @param {apiService} service
 * @param {String} user         The user ID
 * @param {AbsenceElem} elem
 * @param {object}     event
 *
 * @return {Promise}        Promise the AbsenceElem document, modified with the event ID
 */
function saveEvent(service, user, elem, event)
{
    var Q = require('q');
    var deferred = Q.defer();
    var EventModel = service.app.db.models.CalendarEvent;



    function fwdPromise(err, event)
    {
        if (err) {
            return deferred.reject(err);
        }

        elem.event = event._id;
        deferred.resolve(elem);
    }


    /**
     * Set event properties and save
     */
    function setProperties(eventDocument)
    {
        eventDocument.dtstart = event.dtstart;
        eventDocument.dtstart = event.dtend;
        eventDocument.user = {
            id: user,
            name: '?'
        };

        eventDocument.save(fwdPromise);
    }



    if (elem.event) {
        EventModel.findById(elem.event, function(err, existingEvent) {
            if (existingEvent) {
                setProperties(existingEvent);
            } else {
                setProperties(new EventModel());
            }
        });

        return deferred.promise;
    }


    // create new document

    var newEventDocument = new EventModel();
    setProperties(newEventDocument);

    return deferred.promise;
}


/**
 * This function will create or update an absence element
 *
 * @param {apiService}                  service
 * @param {String} user                 The user ID
 * @param {object} elem                 document
 *
 *
 * @return {Promise}        Promise the AbsenceElem document
 */
function saveElement(service, user, elem)
{
    var Q = require('q');
    var deferred = Q.defer();
    var ElementModel = service.app.db.models.AbsenceElem;

    function setProperties(element)
    {
        element.quantity = elem.quantity;
        // consumed quantity will be updated via model hook
        element.right = elem.right;
        element.user = {
            id: user,
            name: '?'
        };

        saveEvent(service, user, element, elem.event).then(function(savedEvent) {
            element.save().then(function(savedDoc) {
                deferred.resolve(savedDoc);
            }, deferred.reject);

        });
    }


    if (elem._id) {
        // updated existing element
        ElementModel.findById(elem._id, function(err, existingElement) {
            if (elem) {
                setProperties(existingElement);
            } else {
                setProperties(new ElementModel());
            }
        });
        return deferred.promise;
    }

    // create new element
    setProperties(new ElementModel());
    return deferred.promise;
}




/**
 * @param {apiService} service
 * @param {String} user             absence owner object ID
 * @param {Object} params
 * @return {Promise} promised distribution array
 */
function saveAbsence(service, user, params) {

    var Q = require('q');

    if (params.distribution === undefined || params.distribution.length === 0) {
        Q.fcall(function () {
            throw new Error('right distribution is mandatory to save an absence request');
        });
    }

    var elem, savedEventPromises = [];



    for(var i=0; i<params.distribution.length; i++) {
        elem = params.distribution[i];
        savedEventPromises.push(saveElement(service, user, elem));
    }

    return Q.all(savedEventPromises);

}

/**
 * @param {apiService} service
 * @param {Object} params
 * @return {Promise} promised fieldsToSet object
 */
function prepareRequestFields(service, params)
{
    var Q = require('q');
    var deferred = Q.defer();
    var fieldsToSet = {
        user: {
            id: params.user,
            name: '?'
        }
    };


    if (undefined !== params.absence) {
        var promisedDistribution = saveAbsence(service, params.user, params.absence);
        promisedDistribution.then(function(distribution) {
            fieldsToSet.absence = {
                distribution: distribution
            };
            deferred.resolve(fieldsToSet);
        }, service.error);
    }

    if (undefined !== params.time_saving_deposit) {
        fieldsToSet.time_saving_deposit = params.time_saving_deposit;
        deferred.resolve(fieldsToSet);
    }

    if (undefined !== params.workperiod_recover) {
        fieldsToSet.workperiod_recover = params.workperiod_recover;
        deferred.resolve(fieldsToSet);
    }

    return deferred.promise;
}

    
    
/**
 * Update/create the request document
 * 
 * @param {apiService} service
 * @param {Object} params
 */  
function saveRequest(service, params) {

    var Gettext = require('node-gettext');
    var gt = new Gettext();

    
    var RequestModel = service.app.db.models.Request;
    
    /**
     * Update link to absences elements in the linked events
     * @param {Request} requestDoc
     */
    function saveEmbedEvents(requestDoc)
    {
        var elem, event;

        if (requestDoc.absence === undefined) {
            return;
        }

        requestDoc.absence.populate('distribution');

        for( var i=0; i<requestDoc.absence.distribution.length; i++) {

            elem = requestDoc.absence.distribution[i];
            event = elem.populate('event');

            if (event.absenceElem !== elem._id) {
                event.absenceElem = elem._id;
                event.save();
            }
        }
    }

    /**
     * The request document has been saved
     * @param {Request} document
     */
    function endWithSuccess(document, message)
    {
        saveEmbedEvents(document);

        // Do not wait for event update?

        service.resolveSuccess(
            document,
            message
        );
    }


    prepareRequestFields(service, params).then(function(fieldsToSet) {

        var filter = {
            _id: params.id,
            deleted: false
        };

        filter['user.id'] = params.user;

        if (params.id)
        {
            RequestModel.findOneAndUpdate(filter, fieldsToSet, function(err, document) {
                if (service.handleMongoError(err))
                {
                    endWithSuccess(
                        document,
                        gt.gettext('The request has been modified')
                    );
                }
            });

        } else {

            fieldsToSet.createdBy = {
                id: params.user, //TODO this is the request owner, replace by the createdBy user
                name: '?'
            };

            RequestModel.create(fieldsToSet, function(err, document) {

                if (service.handleMongoError(err))
                {
                    endWithSuccess(
                        document,
                        gt.gettext('The request has been created')
                    );
                }
            });
        }

    });
}
    
    

    
    
    
    



/**
 * Construct the type save service
 * @param   {object}          services list of base classes from apiService
 * @param   {express|object}  app      express or headless app
 * @returns {saveItemService}
 */
exports = module.exports = function(services, app) {
    
    var service = new services.save(app);
    
    /**
     * Call the right type save service
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


