define(['q'], function(Q) {
    
    'use strict';


	return ['$scope', '$location', 'Rest', 'AbsenceEdit', function($scope, $location, Rest, AbsenceEdit) {


        
        AbsenceEdit.initScope($scope);
        
        // resources 
        var calendars = Rest.account.calendars.getResource();
        var calendarEvents = Rest.account.calendarevents.getResource();
        var accountCollection = Rest.account.collection.getResource();
        var accountRights = Rest.account.accountrights.getResource();
        var user = Rest.user.user.getResource();

        $scope.request = Rest.account.requests.getFromUrl().loadRouteId();

        
        if ($scope.request.$promise) {
            $scope.request.$promise.then(function() {
                // edit this request
                
                $scope.editRequest = true;
                
            });
        } else {
            
            // create a new request
            $scope.newRequest = true;
            
            user.get().$promise.then(function(user) {
                AbsenceEdit.onceUserLoaded($scope, user, calendarEvents);
            });
            
        }
        
        /**
         * Period picker callback for working times
         */
        $scope.loadWorkingTimes = function(interval) {

            var deferred = Q.defer();

            user.get().$promise.then(function(user) {
                var account = user.roles.account;

                if (!account.currentScheduleCalendar) {
                    deferred.reject('No valid schedule calendar');
                    return;
                }

                calendarEvents.query({
                    calendar: account.currentScheduleCalendar._id,
                    dtstart: interval.from,
                    dtend: interval.to,
                    substractNonWorkingDays: true
                }).$promise.then(deferred.resolve);
            });

            return deferred.promise;

        };

        /**
         * Period picker callback for non working days
         */
        $scope.loadEvents = function(interval) {
            var deferred = Q.defer();

            calendars.query({
                type: 'nonworkingday'
            }).$promise.then(function(nwdCalendars) {

                var nwdCalId = nwdCalendars.map(function(cal) {
                    return cal._id;
                });

                calendarEvents.query({
                    calendar: nwdCalId,
                    dtstart: interval.from,
                    dtend: interval.to
                }).$promise.then(deferred.resolve);
            });

            return deferred.promise;
        };
        
        
        $scope.loadScholarHolidays = function(interval) {

            var deferred = Q.defer();

            calendars.query({
                type: 'holiday'
            }).$promise.then(function(hCalendars) {

                var hCalId = hCalendars.map(function(cal) {
                    return cal._id;
                });

                calendarEvents.query({
                    calendar: hCalId,
                    dtstart: interval.from,
                    dtend: interval.to
                }).$promise.then(deferred.resolve);
            });

            return deferred.promise;
        };



        /**
         * Go back to requests list, admin view
         */
        $scope.back = function() {
            $location.path('/account/requests');
        };


        /**
         * Go from the period selection to the right assignments step
         */
        $scope.next = AbsenceEdit.getNextButtonJob($scope, accountCollection, accountRights);


        $scope.saveAbsence = function() {
            console.log('save request');
        };

	}];
});

