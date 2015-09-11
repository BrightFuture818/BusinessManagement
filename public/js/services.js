define([
    'angular', 
    'services/loadableResource', 
    'services/catchOutcome', 
    'services/rest',
    'services/absence-edit',
    'services/request-stat',
    'angularResource'], 
    function (angular, loadableResource, catchOutcome, rest, AbsenceEdit, getRequestStat) {
    
	'use strict';
    
	
	/* Services */
	
	angular.module('inga.services', ['ngResource'])
	
    
    
    /**
     * catch outcome messages from the rest service and 
     *  - forward messages to rootscope
     *  - highlight the missing fields
     */
    .factory('catchOutcome', ['$rootScope', '$q', function($rootScope, $q) {
        
        return catchOutcome(angular, $rootScope, $q);
    }])
    
    
    .factory('ResourceFactory', 
        ['$resource', function($resource) {
        
        /**
         * create a resource
         * @param   {string} collectionPath path to rest service
         * @param   {object} parameters Optional parameters default is { id:'@_id' }
         */
        var ResourceFactory = function(collectionPath, parameters) {
            
            if (undefined === parameters) {
                parameters = { id:'@_id' };   
            }
            
            return $resource(collectionPath, parameters, 
                { 
                    'save': { method:'PUT' },    // overwrite default save method (POST)
                    'create': { method:'POST' }
                }  
            );
        };
        
            
        return ResourceFactory;
        
    }])
    
    

	/**
	 * Create a resource to an object or to a collection
	 * the object resource is created only if the angular route contain a :id
	 */ 
	.factory('IngaResource', 
        ['ResourceFactory', '$routeParams', 'catchOutcome', 
        function(ResourceFactory, $routeParams, catchOutcome) {
            
        var buildResource = loadableResource(ResourceFactory, $routeParams, catchOutcome);
        
		/**
		 * Get the resource
		 * @param   {string} collectionPath [[Description]]
		 * @returns {Resource} the resource
		 */
		return function(collectionPath)
		{
			if ($routeParams.id) {
				return buildResource.real(collectionPath);
			}
			
			return buildResource.fake(collectionPath);
		};

	}])
	
    /**
     * Load the collection of REST services
     */
    .factory('Rest', ['ResourceFactory', 'IngaResource', 
        function(ResourceFactory, IngaResource) {
            return rest(ResourceFactory, IngaResource);
        }
    ])
    
    
    /**
     * Set stats on a request object
     * Informations on the selected period
     * Information for the approval steps progression status
     */
    .factory('getRequestStat',
        function() {
            return getRequestStat;
        }
    )


    /**
     *
     */
    .factory('AbsenceEdit',  
        function() {
            return AbsenceEdit;
        }
    )
    
        
    /**
	 * Add periods form in the array of items
     * 
	 */  
	.factory('addPeriodRow', function() {
        
      
        /**
         * Add periods form in the array of items (deferred service call)
         *
         * @param {Array}    items         items binded to rows
         * @param {$resource} itemResource resource for one row
         */
        return function($scope, items, itemResource) {

            require(['services/addPeriodRow'], function(serviceFn) {
                serviceFn(items, itemResource);
                $scope.$apply();
            });
        };
	})
    
 
	.factory('saveAccountCollection', ['$q', 'catchOutcome', function($q, catchOutcome) {

        /**
         * Save account collections in scope
         *
         */
        return function($scope) {
            var deferred = $q.defer();
            require(['services/saveAccountCollection'], function(serviceFn) {
                serviceFn($scope, $q, catchOutcome).then(deferred.resolve);
            });
            
            return deferred.promise;
        };
	}])
    
    
    .factory('saveAccountScheduleCalendar', ['$q', 'catchOutcome', function($q, catchOutcome) {

        /**
         * Save account schedule calendar in scope
         *
         */
        return function($scope) {
            var deferred = $q.defer();
            require(['services/saveAccountScheduleCalendar'], function(serviceFn) {
                serviceFn($scope, $q, catchOutcome).then(deferred.resolve);
            });
            
            return deferred.promise;
        };
	}])
    
    
    .factory('saveBeneficiaries', ['$q', 'catchOutcome', function($q, catchOutcome) {

        /**
         * Save account collections in scope
         * 
         * @param {Scope} $scope
         * @param {Integer} collectionId  The saved collection _id
         */
        return function($scope, collectionId) {
            var deferred = $q.defer();
            require(['services/saveBeneficiaries'], function(serviceFn) {
                serviceFn($scope, collectionId, $q, catchOutcome).then(deferred.resolve);
            });
            
            return deferred.promise;
        };
	}])
	
	


    .factory('removeSubDocument', function() {

        /**
         * Remove subdocument from array
         * @param {Array}   arr is a list of subdocuments
         * @param {Object}  Object from a mongoose document from a REST service
         * @return {Array}  The modified array
         */
        return function(arr, oldDocument) {

            if (-1 === arr.indexOf(oldDocument)) {
                // not found, return the unmodified array
                return arr;
            }

            if (undefined === oldDocument._id) {
                // not saved, return the unmodified array
                return arr;
            }

            return arr.filter(function(doc) {
                if (doc._id === oldDocument._id) {
                    return false;
                }

                return true;
            });
        };

	})


    .factory('setSubDocument', function() {

        /**
         * Replace subdocument by id
         * or push the new document
         * @param {Array}   arr is a list of subdocuments
         * @param {Object}  Object from a mongoose document from a REST service
         * @return {Array}  The modified array
         */
        return function(arr, newDocument) {

            if (-1 !== arr.indexOf(newDocument)) {
                // allready inserted
                return arr;
            }

            if (undefined === newDocument._id) {
                arr.push(newDocument);
                return arr;
            }

            return arr.map(function(doc) {
                if (doc._id === newDocument._id) {
                    return newDocument;
                }

                return doc;
            });
        };

	})


    .factory('decimalAdjust', function() {
        /**
         * Decimal adjustment of a number.
         *
         * @param {String}  type  The type of adjustment.
         * @param {Number}  value The number.
         * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
         * @returns {Number} The adjusted value.
         */
        return function decimalAdjust(type, value, exp) {
            // If the exp is undefined or zero...
            if (typeof exp === 'undefined' || +exp === 0) {
                return Math[type](value);
            }
            value = +value;
            exp = +exp;
            // If the value is not a number or the exp is not an integer...
            if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
                return NaN;
            }
            // Shift
            value = value.toString().split('e');
            value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
            // Shift back
            value = value.toString().split('e');
            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        };
    });
});
