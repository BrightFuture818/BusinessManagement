'use strict';

var api = {};
exports = module.exports = api;


/**
 * Load models into an external mongo connexion
 * for actions on databases
 * 
 * @param	object	app 	the headless mock app
 * @param	object	db		Mongoose connexion
 */  
function inga_loadMockModels(app, db)
{
	//config data models
	var models = require('../models');
	
	models.requirements = {
		mongoose: app.mongoose,
		db: db,	
		autoIndex: true
	};
	
	models.load();
}



/**
 * Get a database name from a company name
 * Used for auto-conversion in a form
 * 
 * @todo this will be done client side
 * 
 * @return string | false
 */  
api.dbName = function(name) {
	var str = name.replace(/[^a-z0-9]/gi, '').toLowerCase();
	
	if (str.length <= 2)
	{
		return false;
	}
	
	return str;
};


/**
 * db name for field validity
 * this is the server side valididty test
 * 
 * @return string
 */  
api.isDbNameValid = function(app, dbName, callback) {
	
	
	if (!dbName.match(/[a-z0-9]+/gi) || dbName.length <= 2 || dbName.length > 100)
	{
		callback(false);
		return;
	}
	
	this.listDatabases(app, function(databases) {
		
		for(var i =0; i< databases.length; i++)
		{
			if (databases[i].name === dbName)
			{
				callback(false);
				return;
			}
		}
		
		
		callback(true);
	});
};






/**
 * Get all databases
 * 
 * @param	object		db			database connexion
 * @param	function 	callback	function to receive results
 * 
 * @return Array
 */  
api.listDatabases = function(app, callback) {
	
	var Admin = app.mongoose.mongo.Admin(app.db.db);

	Admin.listDatabases(function(err, result) {
		
		if (err) {
			console.log(err);
		}

		callback(result.databases);    
	});
	
};



/**
 * Create a new virgin database with initialized Company infos
 * Additional connexion to database is used
 * 
 * @param	Object 		app			express app or mock headless app variable
 * @param	string		dbname		database name, verified with this.isDbNameValid
 * @param	object		companyDoc	A company document object
 * @param	function	callback()	done function
 */  
api.createDb = function(app, dbName, company, callback) {
	
	var db = app.mongoose.createConnection(app.config.mongodb.prefix + dbName);
	db.on('error', console.error.bind(console, 'CompanyApi.createDb mongoose connection error: '));
	
	
	
	db.once('open', function() {

		inga_loadMockModels(app, db);
		
		// create the company entry
		
		var companyDoc = new db.models.Company(company);
		
		
		companyDoc.save(function (err) {
			if (err) {
				console.error(err);
			} else {
				callback();
			}
			
			db.close();
		});
		
	});
	
};


/**
 * Delete a database
 * 
 * @param				app
 * @param	string		dbName
 * @param	function	callback
 */  
api.dropDb = function(app, dbName, callback) {
	
	
	
	var db = app.mongoose.createConnection(app.config.mongodb.prefix + dbName);
	db.on('error', console.error.bind(console, 'CompanyApi.deleteDb mongoose connection error: '));
	
	db.once('open', function() {
		db.db.dropDatabase(function(err, result) {
			if (err)
			{
				throw Exception(err);
			} else {
				callback();
			}
			db.close();
		});
	});
};


/**
 * Use a database in the app
 * @param	object		app			Express app or headless mock app
 * @param	string		dbName		
 * @param	function	callback 	once connected
 * 
 */  
api.bindToDb = function(app, dbName, callback) {

	var mongoose = require('mongoose');
	app.mongoose = mongoose;

	//setup mongoose
	app.db = mongoose.createConnection(app.config.mongodb.prefix + dbName);
	app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
	app.db.once('open', callback);
};


/**
 * get company document from a database using an external connexion
 * 
 * 
 */  
api.getCompany = function(app, dbName, callback) {
	
	var db = app.mongoose.createConnection(app.config.mongodb.prefix + dbName);
	db.on('error', console.error.bind(console, 'CompanyApi.getCompany mongoose connection error: '));
	
	db.once('open', function() {
		
		inga_loadMockModels(app, db);
		
		db.models.Company.find().exec(function (err, docs) {
			if (err) {
				throw Exception(err);
			}
			callback(null);
			db.close();
		});

		
	});
};


/**
 * Get all comany documents from all the databases
 */  
api.getCompanies = function(app, callback) {
	this.listDatabases(app, function(databases) {
		
		var async = require('async');
		
		var asyncTasks = [];
		for(var i=0; i<databases.length; i++) {
			asyncTasks.push(function(async_done) {
				this.getCompany(app, databases[i].name, async_done);
			});
		}
		
		async.parallel(asyncTasks, function(results) {
			callback(results);
		});
	});
};
