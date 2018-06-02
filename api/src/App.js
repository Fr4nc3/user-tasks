require('../models/Users');
require('../models/Tasks');
require('../config/passport');
var atob = require('atob');
import http from "http";
import express from "express";

const PORT = 8080;
const DELAY = 2500;

const reverse = s => {
    const out = s.split("").reverse().join("");
    return new Promise(resolve => {
        setTimeout(() => resolve(out), DELAY);
    });
};
const getUser = t =>{
   return JSON.parse(atob(t.split('.')[1]));
}

const app = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var jwt = require('express-jwt');

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var User = mongoose.model('User');

mongoose.connect('mongodb://localhost/user-tasks');
var auth = jwt({ secret: 'SECRET', userProperty: 'payload' });

app.server = http.createServer(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cookieParser());


app.get("/api/reverse/:something", async (req, res) => {
    const something = req.params.something;
    console.log(`Reversing "${something}"`);
    const reversed = await reverse(something);
    res.json(reversed);
});

app.get('/api/tasks', function (req, res, next) {

    const u = getUser(req.headers.authorization);
    console.log(u._id)
    Task.find({Author:u._id}, function (err, tasks) { 
        if (err) {
            return next(err);
        }
        console.log(tasks);
        res.json(tasks);
    });
});


// add a new task
app.post('/api/task', function (req, res, next) {
    var task = new Task(req.body);
    const u = getUser(req.headers.authorization);
    console.log(u)
    console.log(typeof(u._id));
    task.Author = u._id;
    task.save(function (err, task) {
        if (err) {
            return next(err);
        }

        res.json({status:'Ok'});
    });
});


app.delete('/api/tasks/:task', function (req, res, next) {
    console.log(req);

});






app.post('/api/register', function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password)

    user.save(function (err) {
        if (err) { return next(err); }

        return res.json({ token: user.generateJWT() })
    });
});

app.post('/api/login', function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }

        if (user) {
            return res.json({ token: user.generateJWT() });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});



app.server.listen(PORT);
console.log(`API started on port ${app.server.address().port}`);
