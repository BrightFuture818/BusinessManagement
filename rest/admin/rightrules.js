'use strict';

var ctrlFactory = require('../controller');



function listController() {
    ctrlFactory.list.call(this, '/rest/admin/rightrules');
    
    this.controllerAction = function() {
        this.jsonService(this.service('admin/rightrules/list'));
    };
}
listController.prototype = new ctrlFactory.list();


function getController() {
    ctrlFactory.get.call(this, '/rest/admin/rightrules/:id');
    
    this.controllerAction = function() {
        this.jsonService(this.service('admin/rightrules/get'));
    };
}
getController.prototype = new ctrlFactory.get();


function save() {
    this.jsonService(this.service('admin/rightrules/save'));
}

function createController() {
    ctrlFactory.create.call(this, '/rest/admin/rightrules');
    this.controllerAction = save;
}
createController.prototype = new ctrlFactory.create();

function updateController() {
    ctrlFactory.update.call(this, '/rest/admin/rightrules/:id');
    this.controllerAction = save;
}
updateController.prototype = new ctrlFactory.update();

function deleteController() {
    ctrlFactory.delete.call(this, '/rest/admin/rightrules/:id');
    
    this.controllerAction = function() {
        this.jsonService(this.service('admin/rightrules/delete'));
    };
}
deleteController.prototype = new ctrlFactory.delete();



exports = module.exports = {
    list: listController,
    get: getController,
    create: createController,
    update: updateController,
    delete: deleteController
};