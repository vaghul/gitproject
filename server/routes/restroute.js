/**
 * Created by Vaghula krishnan on 021-01-2015.
 */

'use strict';

var accountCtrl = require("../api/api");

module.exports = {


    '/git/clone' : {
        methods: ['post'],
        fn: [accountCtrl.clone]
    }

};