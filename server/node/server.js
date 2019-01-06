var defaultConfiguration = 
{
	  port: 80
	, SSLPort: 443
	, Folder: 'd:/Development/Sonata/main-site/'
	, UseSSL: false
	, RedirectToSSL:true
};


var configuration = defaultConfiguration;

const fs = require('fs');

if (process.argv.length < 2)
{
	console.log('usage node server.js [configuration file] ');
}
else
{
	var configPath = process.argv[2];
	if (fs.existsSync(configPath)) 
	{
		configuration = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		console.log('configuration file: ' + configPath + ' has been loaded');
		console.log("configuration:\n");
	}
	else
	{
		console.log('configuration file: ' + configPath + ' doesn\'t exist');
		process.exit(1);
	}

	console.log(configuration);

	/*
	console.log('command line arguments:');
	console.log('-----------------------');
	process.argv.forEach(function (val, index, array) {
	  console.log(index + ': ' + val);
	});
*/
	var connect = require('connect');
	var serveStatic = require('serve-static');

	/*
		var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);
*/


		const https = require('https');
		const express = require('express');


	if (configuration.UseSSL == true)
	{

		if (configuration.RedirectToSSL == true)
		{

			var http = require('http');
			http.createServer(function (req, res) {
				res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
				res.end();
			}).listen(configuration.port, function()
			{
				console.log('Server redirecting non-secure port: ' +  configuration.port + ' to secure port: '+  configuration.SSLPort);
			});
		}
	


		const app = express();
		app.use('/',express.static(configuration.Folder));
		//app.get('/', function(req, res) {
		//  return res.end('<p>This server serves up static files.</p>');
		//});

		const options = {
		  key: fs.readFileSync('key.pem', 'utf8'),
		  cert: fs.readFileSync('cert.pem', 'utf8'),
		  passphrase: 'Deangelo565!*87beware'
		};
		const server = https.createServer(options, app);

		server.listen(configuration.SSLPort, function()
		{
			console.log('Server running on port ' +  configuration.SSLPort);
		});


	}
	else
	{
		connect().use(serveStatic(configuration.Folder)).listen(configuration.port, function()
		{
			console.log('Server running on port ' +  configuration.port);
			
		});
	}
}

