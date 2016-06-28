// RESTFUL api's should be state less, use HTTP verbs, expose a directory like url pattern and transfer json and or XML

// Include express, lodash, bodyParser, morgan
// we use express for routing and middleware

var express = require('express'), // require express
    _ = require('lodash'),  // utility library that makes working with objects and arrays easier
    bodyParser = require('body-parser'), // body parser makes it possible to post json to the server
    morgan = require('morgan'),
    app = express(); // create an express app


// MIDDLEWARE is just a function (req,res,next) its just a bunch of callbacks
// We could make api calls query databases whatever we need to do before we go to the next middleware. we either need to end the response cycle  by calling  res.send() or call next()

// There are 5 different types of middleware
// 3rd party, Router Level, Application Level, Error-handeling and built-in

// when ever a request comes in
// it will run through this stack of middleware in the order
// we register them
// using the .use() method, we can setup application middleware
// We can configure express to serve static files
// We could use ejs,jade or some other templating framework for our views. Or just send html file

app.use(express.static('client'));

// HTTP request logger middleware for node.js.
app.use(morgan('combined'))

// By default express doesnt know how to handle JSON so we need to handle that
//A new body object containing the parsed data is populated on the request object after the middleware
//This object will contain key-value pairs when extended is true the value can be any type
app.use(bodyParser.urlencoded({extended:true}));

// body-parser extracts the entire body portion of an incoming request stream and
// exposes it on req.body as something easier to interface with
app.use(bodyParser.json());


// HTTP Verb GET,POST,PUT,DELETE  (CRUD Create,Read,Update,Destroy)

// Create a user to make sure everyting is working
// As soon as we restart our server we will lose this data

var users = [
    {name:"Sally Rally",intro: "hello my name is sally", age: 24, gender:"female"}
];
var id = 0;

app.get('/users', function(req, res){
    res.json(users);
});

app.get('/users/:id', function(req, res){
    var user = _.find(users, {id: req.params.id});
    res.json(user || {});
});

app.post('/users', function(req, res) {
    var user = req.body;
    id++; // lets refactor this to use some middleware
    user.id = id + '';

    users.push(user);

    res.json(user);
});


app.put('/users/:id', function(req, res) {
    var update = req.body;
    if (update.id) {
        delete update.id
    }

    var user = _.findIndex(users, {id: req.params.id});
    if (!users[user]) {
        res.send();
    } else {
        var updateduser = _.assign(users[user], update);
        res.json(updateduser);
    }
});

app.listen(3000);
console.log('on port 3000');

