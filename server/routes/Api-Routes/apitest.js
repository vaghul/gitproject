'use strict';

var pushtestCtrl = require("../../api/pushtest");
var cloneCtrl =require("../../api/clone")

module.exports = {

	'/git/pushtest' : {
        methods: ['post'],
        fn: [pushtestCtrl.pushtest]
    },
    '/git/push/json' : {
        methods: ['post'],
        fn: [cloneCtrl.clone]
    }
};