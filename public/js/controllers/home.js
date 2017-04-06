define([], function() {

    'use strict';

	return [
        '$scope',
        'Rest',
        '$q',
        'departmentReload',
        'renewalChart',
        'gettext',
        '$http',
        'getCreateRequest',
        '$modal',
        '$location',
            function(
                $scope,
                Rest,
                $q,
                departmentReload,
                renewalChart,
                gettext,
                $http,
                getCreateRequest,
                $modal,
                $location) {



        var title = gettext('Home');
        if (undefined !== $scope.company) {
            title = $scope.company.name+' - '+gettext('Home');
        }
        $scope.setPageTitle(title);

        function execAfterSessionLoad() {

            if ($scope.sessionUser.isAccount) {

                $scope.createRequest = getCreateRequest($scope);

                var beneficiariesResource = Rest.account.beneficiaries.getResource();

                renewalChart($scope, beneficiariesResource);
            }



            if ($scope.sessionUser.isManager) {
                // load waiting requests

                var departmentsResource = Rest.manager.departments.getResource();
                var waitingRequestResource = Rest.manager.waitingrequests.getResource();

                $scope.waitingrequests = waitingRequestResource.query();
                $scope.departments = departmentsResource.query();
            }

            $scope.department = $scope.sessionUser.department;


            if ($scope.sessionUser && !$scope.sessionUser.isAuthenticated) {
                $http.get('/rest/anonymous/createfirstadmin').then(function(response) {
                    if (response.data.allowed) {
                        var adminModal = $modal({scope: $scope, templateUrl: 'partials/utils/home.firstadmin.modal.html', show: true });

                        $scope.createFirstAdmin = function() {
                            adminModal.hide();
                            $location.path('/login/createfirstadmin');
                        };
                    }

                });
            }
        }

        if (undefined !== $scope.sessionUser) {
            execAfterSessionLoad();
        } else {
            $scope.$watch('sessionUser', execAfterSessionLoad);
        }
	}];
});
