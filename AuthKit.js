// (c) 2012 Buwei Chiu (bu) <bu@hax4.in>
//
// AuthKit may be freely distributed under the MIT license.
// For all details and documentation:
// http://authkit.hax4.in/
//

var util = require("util");

// Authentication methods
// =======================

exports.authentication = {};
exports.authentication.methods = {};

// Base authentication class
// ---------------------------

// A base type for all authentication to follow
var BaseAuthenticationMethod = function() {
	return this;
};

// we define that authenticate should have three different parameter: username, password, callback(err, result)
BaseAuthenticationMethod.prototype.authenticate = function(username, password, callback) {
	return callback(new Error("Authenticate is not implemented yet."));
};

// if someone call getName, it will return method name
BaseAuthenticationMethod.prototype.getName = function() {
	return this.method_name;
};

// Expose to public
exports.authentication.methods = {};
exports.authentication.methods.base = BaseAuthenticationMethod;

// Config authentication class
// -----------------------------

// ConfigAuthentication read a object which structured in { key_name: key_token }
var configAuthentication = function(authentication_infos) {

	if(!authentication_infos) {
		throw new Error("Please give path of authentication keys file");
	}

	this.authentication_tokens = require(authentication_infos);

	this.method_name = "Config";

	return this;
};

// extends the AuthenticationMethod
configAuthentication.prototype = new BaseAuthenticationMethod();

// override the AuthenticationMethod's default authenticate
configAuthentication.prototype.authenticate = function(username, password, callback) {
	var self = this;

	if(username in self.authentication_tokens) {
		if(self.authentication_tokens[username] === password) {
			return callback(null, true);
		}
	}

	return callback(null, false);
};

// Expose to public
exports.authentication.methods.config = configAuthentication;

// Add authenticate method
// ---------------------------
var authentication_methods = [];

exports.authentication.addMethod = function(authentication_method) {
	if( !(authentication_method instanceof BaseAuthenticationMethod) ) {
		throw new Error("Given method is not authentication method.");
	}

	authentication_methods.push(authentication_method);

	return true;
};

// being authenticated, username, password, callback(err, result, authenticated source);
exports.authentication.authenticate = function(username, password, callback) {
	iteratorOverMethods(authentication_methods, 0);

	function iteratorOverMethods(authentication_methods, index) {

		var current_index = parseInt(index, 10);

		// If current method position equals to length , means we had reached end,
		// and we are not being authenticated, so return callback with false (authenticated failed)
		if( authentication_methods.length === current_index ) {
			return callback(null, false);
		}

		authentication_methods[current_index].authenticate(username, password, methodCallback);
		
		// here we will check is user authenticated
		function methodCallback(err, result) {
			if(err) {
				return callback(err);
			}
			
			// if method is successful, callback with true (authenticated) result, and tell the callback who auth that.
			if(result === true) {
				return callback( err, true, authentication_methods[current_index].getName() );
			}
			
			// if this method is not being authenticated, we should try next one.
			return iteratorOverMethods( authentication_methods, (current_index + 1) );
		}
	}
};

// Logger
// ========

var logger_methods = [];

var log = function(text, type) {
	
	iteratorOverLogger(0);
	
	function iteratorOverLogger(index) {
		var current_index = parseInt(index, 10);

		if(logger_methods.length === index) {
			return;
		}

		logger_methods[current_index].log(text, type);
		
		process.nextTick(function() {
			iteratorOverLogger(current_index + 1);
		});
	}
};

exports.log = log;

exports.addLogger = function(logger) {
	if( !(logger instanceof BaseLogger ) ) {
		throw new Error("Given method is not logging method.");
	}

	logger_methods.push(logger);
};

exports.loggers = {};

var BaseLogger = function() {
	return this;
};

BaseLogger.prototype.log = function(text, type) {
	throw new Error("Log is not implemented.");
};

exports.loggers.base = BaseLogger;

var ConsoleLogger = function() {
	return this;
};

ConsoleLogger.prototype = new BaseLogger();

ConsoleLogger.prototype.log = function(text, type) {
	util.log("[" + type + "]: " + text);
};

exports.loggers.console = ConsoleLogger;
