[![build status](https://secure.travis-ci.org/bu/AuthKit.png)](http://travis-ci.org/bu/AuthKit)
# AuthKit

A small bundle of tools that help developer to build authentication and authorization.

-------

This package split in serveral domain, usage are below:

## Server

The function under this domain are specified binding to **Express (>=3.0.0rc1)**.

### Access Related

#### allowAllAjaxOrigin

Allow all request from xHR, avoid of limit of Access-Control-Allow-Origin

	// to use this feature, just put this line to app.js before ** app.use(app.router); **
	
	app.use(AuthKit.server.allowAllAjaxOrigin);

### Method Not Found Message

#### apiNotFoundError && pageNotFoundError

These method will return not found page or message to client.

	// to use this feature, just put this line to app.js after ** app.use(app.router); **
	
	app.use(AuthKit.server.apiNotFoundError);
	app.use(AuthKit.server.pageNotFoundError);
	
