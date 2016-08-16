'use strict';

const gt = require('../gettext');
const util = require('util');
const Mail = require('../mail');


/**
 * Mail send to request owner when a request has been created by an admin
 * and there is no approval
 *
 * @param {Object} app      Express
 * @param {Request} request
 * @returns {Promise}
 */
exports = module.exports = function getMail(app, request) {

    let mail = new Mail(app);

    let requestLink = app.config.url +'/#/account/'+request.getUrlPathType()+'/'+ request._id;

    mail.setSubject(util.format(gt.gettext('%s: request created'), app.config.company.name));

    return request.getUser()
    .then(user => {
        mail.addTo(user);

        let log = request.getlastNonApprovalRequestLog();

        mail.setMailgenData({
            body: {
                name: request.user.name,
                intro: util.format(gt.gettext('A %s has been created on your account by %s'), request.getDispType(), log.user.name),
                action: {
                    instructions: gt.gettext('Consult the details after login into the application'),
                    button: {
                        text: gt.gettext('View request'),
                        link: requestLink
                    }
                }
            }
        });

        return mail;
    });
};
