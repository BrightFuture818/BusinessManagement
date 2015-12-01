define([], function() {

    'use strict';


	return ['$scope', '$location', 'Rest', '$routeParams', '$rootScope',
            function($scope, $location, Rest, $routeParams, $rootScope) {


        $scope.request = Rest.account.requests.getFromUrl().loadRouteId();

        var beneficiariesResource = Rest.account.beneficiaries.getResource();
        var beneficiaries = beneficiariesResource.query();

        var timeSavingAccountsResource = Rest.account.timesavingaccounts.getResource();
        $scope.timeSavingAccounts = timeSavingAccountsResource.query();


        // prepare select
        $scope.rightBeneficiaries = [];
        beneficiaries.$promise.then(function(b) {
            b.forEach(function(beneficiary) {
                $scope.rightBeneficiaries.push({
                    value: beneficiary,
                    label: '<i class="fa fa-asterisk" style="color:'+beneficiary.right.type.color+'" title="'+beneficiary.right.type.name+'"></i> '+beneficiary.right.name
                });
            });
        });


        if ($scope.request.$promise) {
            $scope.request.$promise.then(function() {
                // edit this request
                $scope.editRequest = true;

            });
        } else {

            // create a new request
            $scope.newRequest = true;

            $scope.request.events = [];

        }




        /**
         * Go back to requests list, admin view
         */
        $scope.back = function() {
            $location.path('/account/requests');
        };



        $scope.save = function() {

            // cleanup object
            delete $scope.request.requestLog;
            delete $scope.request.approvalSteps;

            try {
                $scope.request.ingaSave($scope.back);
            } catch(e) {
                $rootScope.pageAlerts.push({
                    message: e.message,
                    type: 'danger'
                });
            }
        };

	}];
});

