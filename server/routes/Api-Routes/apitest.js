'use strict';

var pushtestCtrl = require("../../api/pushtest");

module.exports = {

	'/git/pushtest' : {
        methods: ['post'],
        fn: [pushtestCtrl.pushtest]
    }
};