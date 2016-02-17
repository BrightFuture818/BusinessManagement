define(['angular', 'services'], function (angular) {
	'use strict';
    
    var invokeController = function(path, module, $scope, $injector) {
        
        if (require.defined(path)) {
            // synchronous load if controller file allready loaded
            $injector.invoke(require(path), module, {'$scope': $scope});
        } else {
            
            // console.log('Loading controller async '+path);
            
            require([path], function(ctrlFn) {
				$injector.invoke(ctrlFn, module, {'$scope': $scope});
			});
        }
    };

	/* Controllers */
	
	return angular.module('gadael.controllers', ['gadael.services'])

		// Sample controller where service is being used
		.controller('MyCtrl1', ['$scope', 'version', function ($scope, version) {
			$scope.scopedAppVersion = version;
		}])
		
		// More involved example where controller is required from an external file
		.controller('MyCtrl2', ['$scope', '$injector', function($scope, $injector) {
			require(['controllers/myctrl2'], function(myctrl2) {
				// injector method takes an array of modules as the first argument
				// if you want your controller to be able to use components from
				// any of your other modules, make sure you include it together with 'ng'
				// Furthermore we need to pass on the $scope as it's unique to this controller
				$injector.invoke(myctrl2, this, {'$scope': $scope});
			});
		}])
	
		
		.controller('Home', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/home', this, $scope, $injector);
		}])
	
		.controller('Login', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/login/index', this, $scope, $injector);
		}])
		
		.controller('LoginForgot', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/login/forgot', this, $scope, $injector);
		}])
		
		.controller('LoginReset', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/login/reset', this, $scope, $injector);
		}])

		.controller('LoginGoogle', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/login/google', this, $scope, $injector);
		}])
		
		.controller('CreateFirstAdmin', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/login/createfirstadmin', this, $scope, $injector);
		}])
    
    
    
    
        .controller('AccountRequests', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/account/request/requests', this, $scope, $injector);
		}])
    
        .controller('AccountAbsenceEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/account/request/absence-edit', this, $scope, $injector);
		}])
        .controller('AccountAbsenceView', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/account/request/absence-view', this, $scope, $injector);
		}])
    
        .controller('AccountTimeSavingDepositEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/account/request/time-saving-deposit-edit', this, $scope, $injector);
		}])
        .controller('AccountTimeSavingDepositView', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/account/request/time-saving-deposit-view', this, $scope, $injector);
		}])
    
        .controller('AccountWorkperiodRecoverEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/account/request/workperiod-recover-edit', this, $scope, $injector);
		}])
        .controller('AccountWorkperiodRecoverView', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/account/request/workperiod-recover-view', this, $scope, $injector);
		}])

        .controller('AccountBeneficiaries', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/account/beneficiaries', this, $scope, $injector);
		}])
        .controller('AccountBeneficiaryView', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/account/beneficiary-view', this, $scope, $injector);
		}])
        .controller('AccountCalendarView', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/account/calendar-view', this, $scope, $injector);
		}])
    
    
    
        .controller('ManagerWaitingRequests', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/manager/waitingrequests', this, $scope, $injector);
		}])

        .controller('ManagerWaitingRequest', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/manager/waitingrequest', this, $scope, $injector);
		}])


		
		.controller('Admin', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/index', this, $scope, $injector);
		}])
    
		
		.controller('AdminRequests', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/request/requests', this, $scope, $injector);
		}])
    
        .controller('AdminAbsenceEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/request/absence-edit', this, $scope, $injector);
		}])
        .controller('AdminAbsenceView', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/request/absence-view', this, $scope, $injector);
		}])
    
        .controller('AdminTimeSavingDepositEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/request/time-saving-deposit-edit', this, $scope, $injector);
		}])
        .controller('AdminTimeSavingDepositView', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/request/time-saving-deposit-view', this, $scope, $injector);
		}])
    
        .controller('AdminWorkperiodRecoverEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/request/workperiod-recover-edit', this, $scope, $injector);
		}])
        .controller('AdminWorkperiodRecoverView', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/request/workperiod-recover-view', this, $scope, $injector);
		}])
    
		
		.controller('AdminUsers', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/users', this, $scope, $injector);
		}])
		
		.controller('AdminUserEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/user-edit', this, $scope, $injector);
		}])
    
        .controller('AdminUserView', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/user-view', this, $scope, $injector);
		}])
    
        .controller('AdminBeneficiaryEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/beneficiary-edit', this, $scope, $injector);
		}])

        .controller('AdminAccountCollectionsEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/account-collections-edit', this, $scope, $injector);
		}])
    
        .controller('AdminAccountScheduleCalendarsEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/account-schedulecalendars-edit', this, $scope, $injector);
		}])

		.controller('AdminDepartments', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/departments', this, $scope, $injector);
		}])

        .controller('AdminDepartmentView', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/department-view', this, $scope, $injector);
		}])
		
		.controller('AdminDepartmentEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/department-edit', this, $scope, $injector);
		}])
		
		.controller('AdminCollections', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/collections', this, $scope, $injector);
		}])
		
		.controller('AdminCollectionEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/collection-edit', this, $scope, $injector);
		}])
		
		.controller('AdminCalendars', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/calendars', this, $scope, $injector);
		}])
		
		.controller('AdminCalendarEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/calendar-edit', this, $scope, $injector);
		}])
		
		.controller('AdminTypes', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/types', this, $scope, $injector);
		}])
		
		.controller('AdminTypeEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/type-edit', this, $scope, $injector);
		}])
		
		.controller('AdminRights', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/rights', this, $scope, $injector);
		}])
        
        .controller('AdminRightEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/right-edit', this, $scope, $injector);
		}])
    
        .controller('AdminRightView', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/right-view', this, $scope, $injector);
		}])
        
        .controller('AdminRightRenewalEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/rightrenewal-edit', this, $scope, $injector);
		}])
    
        .controller('AdminRightRuleEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/rightrule-edit', this, $scope, $injector);
		}])
		
		.controller('Signup', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/signup', this, $scope, $injector);
		}])

		.controller('UserSettings', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/user/settings', this, $scope, $injector);
		}])

        .controller('AdminRecoverQuantities', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/recoverquantities', this, $scope, $injector);
		}])

		.controller('AdminRecoverQuantityEdit', ['$scope', '$injector', function($scope, $injector) {
            invokeController('controllers/admin/recoverquantity-edit', this, $scope, $injector);
		}]);
});
