var path = require('path');
var express = require('express');
var webpack = require('webpack');
var proxy = require('http-proxy-middleware');

var config = require('./webpack.config.js');

var request = require('superagent');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var app = express();

/**
 * Starts an express server. Serves app with webpack dev server and proxies API
 * requests to local ICE server
 * @param {string} sid Session ID for ICE instance
 */
function startServer(sid) {

    // configure webpack dev server
    var compiler = webpack(config);

    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));

    // proxy all REST API requests to ICE instance running locally
    app.use('/rest', proxy({
        target: 'https://localhost:8443',
        secure: false // don't choke on self-signed certificates
    }));

    app.get('*', function(req, res) {
        if (req.query.entryId === undefined) {
            // bundle.js fetches the entry id by regexing browser location
            // redirect to the right url if we don't have it
            res.redirect(`${req.url}?entryId=1`);
        } else {
            // set credentials for ICE server
            res.cookie('sessionId', `"${sid}"`);
            res.cookie('userId', '"Administrator"');

            res.sendFile(path.join(__dirname, 'index.html'));
        }
    });

    app.listen(3001, 'localhost', function(err) {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Listening at http://localhost:3001');
    });
}

// authenticate to local ICE instance before starting server
request
    .post('https://localhost:8443/rest/accesstokens')
    .send({
        email: 'Administrator',
        password: 'Administrator',
        processing: true
    })
    .end(function(err, res) {
        if (err || !res.ok) {
            console.log(err.valueOf().toString());
            console.log('Unable to authenticate to ICE backend');
        } else {
            startServer(res.body.sessionId);
        }
    });

