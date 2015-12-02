'use strict';


describe('time saving account rest service', function() {


    var server, collection, right, timeSavingAccount, userAccount;

    var today = new Date();


    beforeEach(function(done) {

        var helpers = require('../mockServer');

        helpers.mockServer('accountRightTimeSavingAccount', function(_mockServer) {
            server = _mockServer;
            done();
        });
    });


    it('Create admin session', function(done) {
        server.createAdminSession().then(function() {
            done();
        });
    });


    it('create new time saving account right in days', function(done) {
        server.post('/rest/admin/rights', {
            name: 'Time saving account',
            quantity: 0,
            quantity_unit: 'D',
            timeSaving: {
                active: true
            }
        }, function(res, body) {
            expect(res.statusCode).toEqual(200);
            expect(body._id).toBeDefined();
            expect(body.timeSaving).toBeDefined();
            expect(body.timeSaving.active).toBeTruthy();
            expect(body.timeSaving.savingInterval).toBeDefined();
            expect(body.timeSaving.savingInterval.useDefault).toBeTruthy();
            expect(body.$outcome).toBeDefined();
            expect(body.$outcome.success).toBeTruthy();

            right = body;

            done();
        });
    });


    it('create renewal', function(done) {

        var start = new Date(today);
        start.setDate(1);
        start.setMonth(0);
        var finish = new Date(start);
        finish.setFullYear(finish.getFullYear()+1);

        server.post('/rest/admin/rightrenewals', {
            right: right._id,
            start: start,
            finish: finish
        }, function(res, body) {
            expect(res.statusCode).toEqual(200);
            expect(body._id).toBeDefined();
            expect(body.$outcome).toBeDefined();
            expect(body.$outcome.success).toBeTruthy();

            done();
        });
    });


    it('Create account session', function(done) {

        server.createUserAccount()
        .then(function(account) {
            userAccount = account;
            done();
        });

    });


    it('create a collection', function(done) {
        server.post('/rest/admin/collections', {
            name: 'Test'
        }, function(res, body) {
            expect(res.statusCode).toEqual(200);
            expect(body._id).toBeDefined();
            collection = body;
            done();
        });
    });


    it('Link account to collection', function(done) {
        server.post('/rest/admin/accountcollections', {
            user: userAccount.user._id,
            rightCollection: collection,
            from: today.toISOString(),
        }, function(res, body) {
            expect(res.statusCode).toEqual(200);
            expect(body._id).toBeDefined();
            expect(body.$outcome).toBeDefined();
            expect(body.$outcome.success).toBeTruthy();

            done();
        });
    });



    it('Link right to collection with a beneficiary', function(done) {

        server.post('/rest/admin/beneficiaries', {
            document: collection._id,
            right: right,
            ref: 'RightCollection'
        }, function(res, body) {
            expect(res.statusCode).toEqual(200);
            expect(body._id).toBeDefined();
            expect(body.$outcome).toBeDefined();
            expect(body.$outcome.success).toBeTruthy();
            done();
        });
    });


    it('logout', function(done) {
        server.get('/rest/logout', {}, function(res) {
            expect(res.statusCode).toEqual(200);
            done();
        });
    });


    it('login account session', function(done) {
        server.authenticateAccount(userAccount).then(function() {
            done();
        });
    });


    it('list time saving accounts', function(done) {
        server.get('/rest/account/timesavingaccounts', {}, function(res, body) {
            expect(res.statusCode).toEqual(200);
            expect(body.length).toEqual(1);
            timeSavingAccount = body[0];
            done();
        });
    });



    it('close the mock server', function(done) {
        server.close(done);
    });


});
