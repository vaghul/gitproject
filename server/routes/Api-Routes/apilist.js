'use strict';

var listCtrl = require("../../api/list");

module.exports = {


    '/' : {
        methods: ['get'],
        fn: [listCtrl.list]
    },

	'/path' : {
	methods:['get'],
	fn:[listCtrl.path]
	},

/*
'/Repo_Files/vaghul/json/Names.txt' : {
	methods:['get'],
	fn:[listCtrl.path]
	}
*/
}