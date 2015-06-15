'use strict';
var hoist = require('hoist-core'),
	User = hoist.models.User,
	Application = hoist.models.Application,
	Organisation = hoist.models.Organisation;

var StatController = function() {

};
StatController.prototype={
	getCounters:function(req,res){
		User.countQ({}).then(function(all){

			return User.countQ({status:"ACTIVE"}).then(function(active){
				return {
					active:active,
					total:all
				};
			}).then(function(object){
				res.send(object);
			});
		});
	},
	getUsers:function(req,res){
		User.findQ()
		.then(function(users){
			res.send(users);
		});
	},
	getApplications:function(req,res){
		Application.findQ()
		.then(function(applications){
			res.send(applications);
		});
	},
	getOrganisations:function(req,res){
		Organisation.findQ()
		.then(function(organisations){
			res.send(organisations);
		});
	}
};
module.exports = new StatController();