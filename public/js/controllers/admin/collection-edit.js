define([], function() {
    
    'use strict';

	return ['$scope', '$location', 'IngaResource', 'ResourceFactory', 'catchOutcome', 'saveBeneficiaries', 
    function($scope, $location, IngaResource, ResourceFactory, catchOutcome, saveBeneficiaries) {

		$scope.collection = IngaResource('rest/admin/collections').loadRouteId();
        
        var rights = ResourceFactory('rest/admin/rights/:id');
	    var beneficiaries = ResourceFactory('rest/admin/beneficiaries/:id');
        
        $scope.rights = rights.query();
        
        if ($scope.collection.$promise) {
            $scope.collection.$promise.then(function(collection) {
                $scope.collectionRights = beneficiaries.query(
                    { document: collection._id , ref: 'RightCollection' }, function() {
                    if (0 === $scope.collectionRights.length) {
                        $scope.addRight();
                    }
                });
            });
        }
        
        $scope.collectionRights = [];
        
        $scope.addRight = function() {
            $scope.collectionRights.push(new beneficiaries);
        };
        
        /**
         * Delete
         */
		$scope.removeRight = function(index) {
            var right = $scope.collectionRights[index];

            if (undefined === right._id || null === right._id) {
                $scope.collectionRights.splice(index, 1);
                return;
            }

            catchOutcome(right.$delete()).then(function() {
                $scope.collectionRights.splice(index, 1);
            });
		};

		$scope.back = function() {
			$location.path('/admin/collections');
		};
		
		$scope.saveCollection = function() {
			$scope.collection.ingaSave(function(collection) {
                saveBeneficiaries($scope, collection._id).then($scope.back);
            });
	    };
	}];
});

