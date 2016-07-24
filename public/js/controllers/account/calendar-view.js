define([], function() {

    'use strict';

	return [
        '$scope',
        '$routeParams',
        'Calendar',
        '$anchorScroll',
        '$location',
        'Rest',
        'gettext',
        function($scope, $routeParams, Calendar, $anchorScroll, $location, Rest, gettext) {

            $scope.setPageTitle(gettext('Personal calendar'));



            var calendarEventsResource = Rest.user.calendarevents.getResource();
            var personalEventsResource = Rest.account.personalevents.getResource();
            var requestsResource = Rest.account.requests.getResource();


            Calendar.initLoadMoreData($scope, calendarEventsResource, personalEventsResource, requestsResource);

            $scope.loadPreviousYear = function() {
                $location.path('/account/calendar/'+$scope.previousYear+'/0');
            };


	    }
    ];
});
