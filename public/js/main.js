require.config({
	paths: {
		angular: 				'../bower_components/angular/angular',
		angularRoute: 			'../bower_components/angular-route/angular-route',
		angularMocks: 			'../bower_components/angular-mocks/angular-mocks',
		angularResource: 		'../bower_components/angular-resource/angular-resource.min',
    	angularstrap:			'../bower_components/angular-strap/dist/angular-strap',
    	angularstraptpl:		'../bower_components/angular-strap/dist/angular-strap.tpl',
    	angular_frfr:			'../bower_components/angular-i18n/angular-locale_fr-fr',	
    	angularGettext: 		'../bower_components/angular-gettext/dist/angular-gettext',
		angularAuth: 			'../bower_components/angular-http-auth/src/http-auth-interceptor',
		paginateAnything:		'../bower_components/angular-paginate-anything/src/paginate-anything',
		passwordStrength: 		'../bower_components/angular-password-strength/build/angular-password-strength.min',
		angularAnimate:			'../bower_components/angular-animate/angular-animate.min',
		angularSanitize:		'../bower_components/angular-sanitize/angular-sanitize.min',
        moment:                 '../bower_components/moment/min/moment-with-locales.min',
        momentDurationFormat:   '../bower_components/moment-duration-format/lib/moment-duration-format',
        q:                      '../bower_components/q/q',
        d3:                     '../bower_components/d3/d3.min',
        teleperiod:             '../bower_components/teleperiod/dist/teleperiod.min',
        angularTeleperiod:      '../bower_components/angular-teleperiod/src/angular-teleperiod',
        angularColorpicker:     '../bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min'
	},
	shim: {
		'angular' : {'exports' : 'angular'},
		'app': ['angular'],
		'routes': ['angular'],
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		},
		'angularResource': ['angular'],
		'angularAuth':['angular'],
		'angularstrap': ['angular'],
		'angularstraptpl': ['angular', 'angularstrap'],
		'angularGettext' : ['angular'],
		'translation': ['angularGettext'],
		'paginateAnything': ['angular'],
		'passwordStrength': ['angular'],
		'angular_frfr': ['angular'],
		'angularAnimate': ['angular'],
		'angularSanitize': ['angular'],
        'q': { 'exports': 'Q' },
        'teleperiod': ['q', 'd3'],
        'angularTeleperiod': ['q', 'angular', 'teleperiod']
	},
	priority: ["angular"]
});





//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
    'angular',
	'app',
    'q',
	'routes',
	'angularstraptpl',
	'angular_frfr',
	'angularAnimate',
	'angularSanitize',
    'angularTeleperiod'
	], 
	function(angular, app, Q) {

		'use strict';

        // hack for Q because shim export for q does not work
        window.Q = Q;

		angular.element().ready(function() {
			angular.resumeBootstrap([app.name]);
		});	
	});


