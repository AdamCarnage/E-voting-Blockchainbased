const express = require('express');
const router = express.Router();
var mysql = require('mysql');

// path to the database
var con = require('./connection').con;


module.exports = {
    // isAdmin
    isAdmin: function(req, res, next) {
        //getting admin value::
        var adminEmail = req.session.admin;

        //query database
        con.query("SELECT * FROM admin WHERE email=$1", [adminEmail], function(err, result) {
            if (err) {
                throw err;
            } else {
                if (result.rows.length > 0) {
                    // set the session:::
                    next();
                } else {
                    res.redirect('/');
                }
            }
        });
    }

    
};
