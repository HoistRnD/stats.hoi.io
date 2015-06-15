'use strict';

function check_ip_address(req,res,next)
{
	require('hoist-core').utils.logger.log("got a request",JSON.stringify(req.ip),JSON.stringify(req.headers));
	if(req.ip === '116.90.139.105' || req.headers["x-real-ip"]==="116.90.139.105")
	{
		next();
		return;
	}
	res.status(401);
	res.send({status:"DENIED"});
	return;
}

module.exports = function(app) {
	var statsController = require('../controllers/stats_controller');
	app.get('/counters', check_ip_address, statsController.getCounters);
	app.get('/users',check_ip_address,statsController.getUsers);
	app.get('/applications',check_ip_address,statsController.getApplications);
	app.get('/organisations',check_ip_address,statsController.getOrganisations);
	app.options('*', function(req, res) {
		res.send("ok");
	});
};