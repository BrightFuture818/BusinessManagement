define(['jquery'], function() {
	return ['$scope', '$http', 'authService', '$rootScope', '$location', function($scope, $http, authService, $rootScope, $location) {
		
		$scope.submit = function() {
			
			$http.post('rest/login', { 
				username: $scope.username, 
				password: $scope.password 
			})
			
			.success(function(data) {
				
				$rootScope.pageAlerts = data.alert;
				
				if (data.success)
				{
					
					
					// change the sign in button to the user parameters menu
					// update the main menu
					$rootScope.reloadSession();
					
					if (jQuery('[inga-auth]').is(':visible'))
					{
						console.log('[inga-auth] visible');
						
						// redirect
						$location.path("/");
					} else {
						
						console.log('[inga-auth] not visible');
						
						// re-send failed HTTP request on 401 status if authentication form displayed 
						// because of the http-auth-interceptor 
						authService.loginConfirmed();
						
						// hide the login form if displayed because of a 401 status on HTTP request
						jQuery('[inga-auth]').show();
						jQuery('.inga-auth-form').hide();
					}
					
					
					
					
				}
			})
			
			.error(function(data) {
				// receive 400 bad request on missing parameters, login or password
				
				for (var fieldname in data.errfor)
				{
					jQuery('input[name="'+fieldname+'"]').closest('.form-group').addClass('has-error');
				}
			});
	    }
	}];
});
