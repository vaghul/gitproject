'use strict';

var rollCtrl = require("../../api/rollback");

module.exports = {


    '/git/rollback' : {
        methods: ['post'],
        fn: [rollCtrl.rollback]
    }

};