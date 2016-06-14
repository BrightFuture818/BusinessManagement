'use strict';

/**
 * Special right list
 * @param {Express} app
 */
function specialRightIndex(app) {

    this.app = app;

    this.objects = {
        'rtt':                  require('./rtt'),
        'timesavingaccount':    require('./timesavingaccount')
    };
}


/**
 * Get all instances of specialRight
 * @returns {Object}
 */
specialRightIndex.prototype.getInstances = function() {

    let instances = {};

    for (let name in this.objects) {
        if (this.objects.hasOwnProperty(name)) {
            instances[name] = this.objects[name](this.app);
        }
    }

    return instances;
};



/**
 * Get list of special right with canCreate=true
 * @return {Array}
 */
specialRightIndex.prototype.getCreateList = function() {
    let list = [];
    let all = this.getInstances();

    for (let name in all) {
        if (all.hasOwnProperty(name) && all[name].canCreate) {
            list.push(all[name]);
        }
    }

    return list;
};



exports = module.exports = specialRightIndex;