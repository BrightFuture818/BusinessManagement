define([], function() {
    
    'use strict';

	return [
        '$scope',
        '$location',
        'Rest', function($scope, $location, Rest) {

            
        var rightResource = Rest.admin.rights.getResource();
        var rightRenewal = Rest.admin.rightrenewals.getResource();
            
        function onRightLoaded(right) {

            // load last renewal for right
            rightRenewal.query({right: right._id}).$promise.then(function(renewals) {
                $scope.renewal = renewals[0];
            });
        }
            
            
        if ($location.search().right) {
            $scope.right = rightResource.get({id: $location.search().right});
            $scope.right.$promise.then(onRightLoaded);
        }
            
        $scope.rightrule = Rest.admin.rightrules.getFromUrl().loadRouteId();
        if ($scope.rightrule.$promise) {
            $scope.rightrule.$promise.then(
                function(rightrule) {
                    $scope.right = rightResource.get({id: rightrule.right});
                    $scope.right.$promise.then(onRightLoaded);
                }
            );
        } else {
            // init with default values
            
            
        }
            
        
        
            

		$scope.back = function() {
			$location.url('/admin/rights/'+$scope.right._id);
		};
		
		$scope.saveRightrule = function() {
            
            if (!$scope.rightrule.right) {
                $scope.rightrule.right = $scope.right._id;
            }
            
			$scope.rightrule.ingaSave($scope.back);
	    };
	}];
});

