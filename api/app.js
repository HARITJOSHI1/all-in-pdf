const path = require('path');
const crypto = require('crypto');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const testRoute = require('./routes/testRoute');
const cookieParser = require('cookie-parser');
const {createUser} = require('./utils/createUser');
const {sessionUrl} = require("./server");

const app = express();

const store = new MongoDBStore({
    uri: sessionUrl,
    collection: "mySessions"
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

const secret = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret,
    resave: false,
    saveUninitialized: false,
    store,
}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use('/api/v1/pdf', createUser, testRoute);

if(process.env.NODE_ENV === 'development') app.use(morgan('dev'));

module.exports = app;