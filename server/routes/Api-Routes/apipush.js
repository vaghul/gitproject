/**
 * Created by Vaghula krishnan on 021-01-2015.
 */

'use strict';

var pushCtrl = require("../../api/push");

module.exports = {

	'/git/push' : {
        methods: ['post'],
        fn: [pushCtrl.push]
    },
	'/git/pushFirst' : {
        methods: ['post'],
        fn: [pushCtrl.pushFirst]
    },
	'/git/pushFiles' : {
        methods: ['post'],
        fn: [pushCtrl.pushFiles]
    },
	'/git/pushReplace' : {
        methods: ['post'],
        fn: [pushCtrl.pushReplace]
    }

};