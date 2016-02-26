

define([
	'angular',
    'jsondates',
	'filters',
	'services',
	'directives',
	'gettext',
	'controllers',
	'angularRoute',
	'angularAuth',
	'paginateAnything',
	'passwordStrength',
    'angularColorpicker',
    'angularImageCrop',
    'angularnvd3'
	], 
	
	function (angular, jsondates) {
	'use strict';

	// Declare app level module which depends on filters, and services
	
	var gadael = angular.module('gadael', [
		'ngRoute',
		'gadael.controllers',
		'gadael.filters',
		'gadael.services',
		'gadael.directives',
		'gadael.gettext',
		'http-auth-interceptor',
		'begriffs.paginate-anything',
		'vr.directives.passwordStrength.width',
	//	'ngAnimate',
		'ngSanitize',
		'mgcrea.ngStrap',
        'tpTeleperiod',
        'colorpicker.module',
        'ImageCropper',
        'nvd3ChartDirectives'
	]);
    
    
    
    gadael.config(function($dropdownProvider) {
        angular.extend($dropdownProvider.defaults, {
            animation: 'am-flip-x',
            html: true
        });
    });

    gadael.config(["$httpProvider", jsondates]);
	

	gadael.run(['$rootScope', '$location', '$http', '$q', 'gettext', 'gettextCatalog',
                function($rootScope, $location, $http, $q, gettext, gettextCatalog) {

        $rootScope.setPageTitle = function(title) {
            $rootScope.pageTitle = gettextCatalog.getString('Gadael - %s').replace(/%s/, gettextCatalog.getString(title));
        };
		
		/**
		 * Update accessibles items and user informations
		 * on the main page
         *
         * @return {Promise}
		 */  
		$rootScope.reloadSession = function() {

            var deferred = $q.defer();

			$http.get('/rest/common').success(function(response) { 
				
				for(var prop in response) {
                    if (response.hasOwnProperty(prop)) {
                        $rootScope[prop] = response[prop];
                    }
				}

				$rootScope.sessionUser.intAuthenticated = response.sessionUser.isAuthenticated ? 1 : 0;

                deferred.resolve(true);
			}).error(deferred.reject);
			
			return deferred.promise;
		};
		
		// sync with serveur session on app start
		$rootScope.reloadSession();
		
		$rootScope.logout = function()
		{
			$http.get('/rest/logout').success(function() { 
				$rootScope.reloadSession().then(function() {
                    $location.path("/");
                });

			});
		};
		
		$rootScope.closeAlert = function(index) {
			$rootScope.pageAlerts.splice(index, 1);
		};
		
		
		$rootScope.$on('$routeChangeStart', function() { 

            /**
             * Default page title
             */
            $rootScope.setPageTitle(gettext('Absence managment'));

			// reset alert messages on page change
			
			setTimeout(function() {
				
				// the message stay on page because the bind is broken
				// it will not be displayed on the next page change
				
				$rootScope.pageAlerts = [];
			}, 2000);
			
		});
		

		$rootScope.$on('$viewContentLoaded', function() {

			// hide the login form and display the loaded page, 
			// usefull if the user exit from an autorization required page
			angular.element(document.querySelector('[gadael-auth]')).css('display', 'block');
			angular.element(document.querySelector('.gadael-auth-form')).css('display', 'none');

			// select active menu item according to the current path
			angular.element(document.querySelectorAll('.navbar-default li')).removeClass('active');
			angular.element(document.querySelector('.navbar-default a[href="#'+$location.path()+'"]')).parent().addClass('active');
		});
	}]);
		
	return gadael;
});




