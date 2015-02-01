/**
 * Created by Vaghula krishnan on 01-02-2015.
 */

'use strict';

var pullCtrl = require("../../api/pull");

module.exports = {

	'/git/pull' : {
        methods: ['post'],
        fn: [pullCtrl.pull]
    },
    '/git/pullfiles' : {
        methods: ['post'],
        fn: [pullCtrl.pullfiles]
    }
    
};