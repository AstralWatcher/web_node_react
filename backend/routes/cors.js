/**
 * Cross-origin resourse sharing (CORS), this module contains all settings for this
 */

const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:4000', 'https://localhost:4443', 'http://localhost:3000', 'https://localhost:3000', 'http:/Astral:3000', 'https:/Astral:3000']; //#TODO add origin  'http:/Astral:3001'

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true
        };
    } else {
        corsOptions = {
            origin: false
        };
    }
    callback(null, corsOptions);
}

exports.cors = cors(); // for get methods
exports.corsWithOptions = cors(corsOptionsDelegate); // for post,put,delete options