define(['angular', 'app'], function(angular, app) {
	'use strict';

	return app.config(['$routeProvider', function($routeProvider) {
		
		$routeProvider.when('/view1', {
			templateUrl: 'partials/partial1.html',
			controller: 'MyCtrl1'
		});
		
		$routeProvider.when('/view2', {
			templateUrl: 'partials/partial2.html',
			controller: 'MyCtrl2'
		});
		
		$routeProvider.when('/home', {
			templateUrl: 'partials/home.html',
			controller: 'Home'
		});
		
		$routeProvider.when('/signup', {
			templateUrl: 'partials/signup.html',
			controller: 'Signup'
		});
		
		$routeProvider.when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'Login'
		});
		
		$routeProvider.when('/login/forgot', {
			templateUrl: 'partials/login/forgot.html',
			controller: 'LoginForgot'
		});
		
		$routeProvider.when('/login/reset/:email/:token/', {
			templateUrl: 'partials/login/reset.html',
			controller: 'LoginReset'
		});
		
		$routeProvider.when('/login/twitter/callback/', {
			templateUrl: 'partials/login/twitter.html',
			controller: 'LoginTwitter'
		});
		
		$routeProvider.when('/login/github/callback/', {
			templateUrl: 'partials/login/github.html',
			controller: 'LoginGithub'
		});
		
		$routeProvider.when('/login/facebook/callback/', {
			templateUrl: 'partials/login/facebook.html',
			controller: 'LoginFacebook'
		});
		
		$routeProvider.when('/login/google/callback/', {
			templateUrl: 'partials/login/google.html',
			controller: 'LoginGoogle'
		});
		
		$routeProvider.when('/login/tumblr/callback/', {
			templateUrl: 'partials/login/tumblr.html',
			controller: 'LoginTumblr'
		});
		
		
		// authenticated pages
		
		// user pages
		
		$routeProvider.when('/user/settings', {
			templateUrl: 'partials/user/settings.html',
			controller: 'UserSettings'
		});
		
        
        // vacation account pages
        
        $routeProvider.when('/account/requests', {
			templateUrl: 'partials/account/request/requests.html',
			controller: 'AccountRequests'
		});
        
        
        $routeProvider.when('/account/requests/absence-edit/:id', {
			templateUrl: 'partials/account/request/absence-edit.html',
			controller: 'AccountAbsenceEdit'
		});

		$routeProvider.when('/account/requests/absence-edit', {
			templateUrl: 'partials/account/request/absence-edit.html',
			controller: 'AccountAbsenceEdit'
		});
        
        $routeProvider.when('/account/requests/absences/:id', {
			templateUrl: 'partials/account/request/absence-view.html',
			controller: 'AccountAbsenceView'
		});
        
        
        
        $routeProvider.when('/account/requests/time-saving-deposit-edit/:id', {
			templateUrl: 'partials/account/request/time-saving-deposit-edit.html',
			controller: 'AccountTimeSavingDepositEdit'
		});
		
		$routeProvider.when('/account/requests/time-saving-deposit-edit', {
			templateUrl: 'partials/account/request/time-saving-deposit-edit.html',
			controller: 'AccountTimeSavingDepositEdit'
		});
        
        $routeProvider.when('/account/requests/time-saving-deposits/:id', {
			templateUrl: 'partials/account/request/time-saving-deposit-view.html',
			controller: 'AccountTimeSavingDepositView'
		});
        
        
        $routeProvider.when('/account/requests/workperiod-recover-edit/:id', {
			templateUrl: 'partials/account/request/workperiod-recover-edit.html',
			controller: 'AccountWorkperiodRecoverEdit'
		});
		
		$routeProvider.when('/account/requests/workperiod-recover-edit', {
			templateUrl: 'partials/account/request/workperiod-recover-edit.html',
			controller: 'AccountWorkperiodRecoverEdit'
		});
        
        $routeProvider.when('/account/requests/workperiod-recovers/:id', {
			templateUrl: 'partials/account/request/workperiod-recover-view.html',
			controller: 'AccountWorkperiodRecoverView'
		});
        
		
		// departments pages
		
		
		// administration pages
		
		$routeProvider.when('/admin', {
			templateUrl: 'partials/admin/index.html',
			controller: 'Admin'
		});
        
        
		
		$routeProvider.when('/admin/requests', {
			templateUrl: 'partials/admin/request/requests.html',
			controller: 'AdminRequests'
		});
        
        
        $routeProvider.when('/admin/requests/absence-edit/:id', {
			templateUrl: 'partials/admin/request/absence-edit.html',
			controller: 'AdminAbsenceEdit'
		});

		$routeProvider.when('/admin/requests/absence-edit', {
			templateUrl: 'partials/admin/request/absence-edit.html',
			controller: 'AdminAbsenceEdit'
		});
        
        $routeProvider.when('/admin/requests/absences/:id', {
			templateUrl: 'partials/admin/request/absence-view.html',
			controller: 'AdminAbsenceView'
		});
        
        
        
        $routeProvider.when('/admin/requests/time-saving-deposit-edit/:id', {
			templateUrl: 'partials/admin/request/time-saving-deposit-edit.html',
			controller: 'AdminTimeSavingDepositEdit'
		});
		
		$routeProvider.when('/admin/requests/time-saving-deposit-edit', {
			templateUrl: 'partials/admin/request/time-saving-deposit-edit.html',
			controller: 'AdminTimeSavingDepositEdit'
		});
        
        $routeProvider.when('/admin/requests/time-saving-deposits/:id', {
			templateUrl: 'partials/admin/request/time-saving-deposit-view.html',
			controller: 'AdminTimeSavingDepositView'
		});
        
        
        $routeProvider.when('/admin/requests/workperiod-recover-edit/:id', {
			templateUrl: 'partials/admin/request/workperiod-recover-edit.html',
			controller: 'AdminWorkperiodRecoverEdit'
		});
		
		$routeProvider.when('/admin/requests/workperiod-recover-edit', {
			templateUrl: 'partials/admin/request/workperiod-recover-edit.html',
			controller: 'AdminWorkperiodRecoverEdit'
		});
        
        $routeProvider.when('/admin/requests/workperiod-recovers/:id', {
			templateUrl: 'partials/admin/request/workperiod-recover-view.html',
			controller: 'AdminWorkperiodRecoverView'
		});
        
		
		$routeProvider.when('/admin/users', {
			templateUrl: 'partials/admin/users.html',
			controller: 'AdminUsers'
		});
		
		$routeProvider.when('/admin/user-edit/:id', {
			templateUrl: 'partials/admin/user-edit.html',
			controller: 'AdminUserEdit'
		});
		
		$routeProvider.when('/admin/user-edit', {
			templateUrl: 'partials/admin/user-edit.html',
			controller: 'AdminUserEdit'
		});
        
        $routeProvider.when('/admin/users/:id', {
			templateUrl: 'partials/admin/user-view.html',
			controller: 'AdminUserView'
		});
        
        $routeProvider.when('/admin/users/:id/account-collections', {
			templateUrl: 'partials/admin/account-collections-edit.html',
			controller: 'AdminAccountCollectionsEdit'
		});
		
        $routeProvider.when('/admin/users/:id/account-schedulecalendars', {
			templateUrl: 'partials/admin/account-schedulecalendars-edit.html',
			controller: 'AdminAccountScheduleCalendarsEdit'
		});
		
        
		$routeProvider.when('/admin/departments', {
			templateUrl: 'partials/admin/departments.html',
			controller: 'AdminDepartments'
		});
		
		$routeProvider.when('/admin/departments/:id', {
			templateUrl: 'partials/admin/department-edit.html',
			controller: 'AdminDepartmentEdit'
		});
		
		$routeProvider.when('/admin/department-edit', {
			templateUrl: 'partials/admin/department-edit.html',
			controller: 'AdminDepartmentEdit'
		});
		
		$routeProvider.when('/admin/collections', {
			templateUrl: 'partials/admin/collections.html',
			controller: 'AdminCollections'
		});
		
		$routeProvider.when('/admin/collections/:id', {
			templateUrl: 'partials/admin/collection-edit.html',
			controller: 'AdminCollectionEdit'
		});
		
		$routeProvider.when('/admin/collection-edit', {
			templateUrl: 'partials/admin/collection-edit.html',
			controller: 'AdminCollectionEdit'
		});
		
		
		$routeProvider.when('/admin/calendars', {
			templateUrl: 'partials/admin/calendars.html',
			controller: 'AdminCalendars'
		});
		
		$routeProvider.when('/admin/calendars/:id', {
			templateUrl: 'partials/admin/calendar-edit.html',
			controller: 'AdminCalendarEdit'
		});
		
		$routeProvider.when('/admin/calendar-edit', {
			templateUrl: 'partials/admin/calendar-edit.html',
			controller: 'AdminCalendarEdit'
		});
		
		
		$routeProvider.when('/admin/types', {
			templateUrl: 'partials/admin/types.html',
			controller: 'AdminTypes'
		});
		
		$routeProvider.when('/admin/types/:id', {
			templateUrl: 'partials/admin/type-edit.html',
			controller: 'AdminTypeEdit'
		});
		
		$routeProvider.when('/admin/type-edit', {
			templateUrl: 'partials/admin/type-edit.html',
			controller: 'AdminTypeEdit'
		});
		
		$routeProvider.when('/admin/rights', {
			templateUrl: 'partials/admin/rights.html',
			controller: 'AdminRights'
		});
        
        $routeProvider.when('/admin/right-edit/:id', {
			templateUrl: 'partials/admin/right-edit.html',
			controller: 'AdminRightEdit'
		});
		
		$routeProvider.when('/admin/right-edit', {
			templateUrl: 'partials/admin/right-edit.html',
			controller: 'AdminRightEdit'
		});
        
        $routeProvider.when('/admin/rights/:id', {
			templateUrl: 'partials/admin/right-view.html',
			controller: 'AdminRightView'
		});
        
        $routeProvider.when('/admin/rightrenewals/:id', {
			templateUrl: 'partials/admin/rightrenewal-edit.html',
			controller: 'AdminRightRenewalEdit'
		});
        
        $routeProvider.when('/admin/rightrenewal-edit', {
			templateUrl: 'partials/admin/rightrenewal-edit.html',
			controller: 'AdminRightRenewalEdit'
		});
        
        $routeProvider.when('/admin/rightrules/:id', {
			templateUrl: 'partials/admin/rightrule-edit.html',
			controller: 'AdminRightRuleEdit'
		});
        
        $routeProvider.when('/admin/rightrule-edit', {
			templateUrl: 'partials/admin/rightrule-edit.html',
			controller: 'AdminRightRuleEdit'
		});
		
		$routeProvider.otherwise({redirectTo: '/home'});
	}]);

});
