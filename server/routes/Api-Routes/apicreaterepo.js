/**
 * Created by Vaghula krishnan on 25-01-2015.
 */

'use strict';

var createCtrl =require("../../api/createrepo");

module.exports = {

        '/git/addrepo' : {
        methods: ['post'],
        fn: [createCtrl.createrepo]
    }

};