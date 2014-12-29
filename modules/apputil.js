'use strict';

/**
 * Add utilities to app or headless app
 * @param {express|object} app
 * 
 */
exports = module.exports = function(app) {
    
    
    //setup utilities
    app.utility = {};
    app.utility.sendmail = require('./sendmail');
    app.utility.slugify = require('./slugify');
    app.utility.workflow = require('./workflow');
    app.utility.gettext = require('./gettext');
    
    /**
     * Load a service
     * 
     * @param {String} path
     *
     * @return {apiService}
     */
    app.getService = function(path) {
        var apiservice = require('restitute').service;
        var getService = require('../api/services/'+path);
        return getService(apiservice, app);
    }
    
    
    app.checkPathOnRequest = function(ctrl) {
        
        var req = ctrl.req;
        
        var gt = req.app.utility.gettext;

        if (0 === ctrl.path.indexOf('/rest/admin/') && (!req.isAuthenticated() || !req.user.canPlayRoleOf('admin'))) {
            ctrl.accessDenied(gt.gettext('Access denied for non administrators'));
            return false;
        }
        
        if (0 === ctrl.path.indexOf('/rest/account/') && (!req.isAuthenticated() || !req.user.canPlayRoleOf('account'))) {
            ctrl.accessDenied(gt.gettext('Access denied for users without vacation account'));
            return false;
        }
        
        if (0 === ctrl.path.indexOf('/rest/user/') && !req.isAuthenticated()) {
            ctrl.accessDenied(gt.gettext('Access denied for annonymous users'));
            return false;
        }
        
        return true;
    }
};
