/**
 * Created by Vaghula krishnan on 021-01-2015.
 */

'use strict';

var cloneCtrl = require("../api/clone");

module.exports = {


    '/git/clone' : {
        methods: ['post'],
        fn: [cloneCtrl.clone]
    }

};