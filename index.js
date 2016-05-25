var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var Parse = require('parse/node').Parse;

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
databaseURI: '',
cloud: __dirname + '/cloud/main.js',
appId: '',
masterKey: '',
push: {
ios: [
      {
      pfx: __dirname + '/certificates/certName.p12', // Dev PFX or P12
      bundleId: '',
      production: false // Dev
      },
      {
      pfx: __dirname + '/certificates/certName.p12', // Dev PFX or P12
      bundleId: '',
      production: true // Prod
      }
      ]
},
fileKey: process.env.FILE_KEY || '', // Add the file key to provide access to files already hosted on Parse
serverURL: '',  // Change to https if needed
liveQuery: {
classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
}
});

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send(__dirname + '/cloud/main.js');
});

var port = process.env.PORT || 8081;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
