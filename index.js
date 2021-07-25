const path = require('path');

const { engine } = require('express-edge');
const edge = require("edge.js");
const express = require('express');
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const connectFlash = require("connect-flash");


const createPostController = require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const logoutController = require("./controllers/logout");


const app = new express();
 
// mongodb+srv://abhishekvtangod:abhi@2000@cluster0.9ugln.mongodb.net/node-blog?retryWrites=true&w=majority

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/node-blog', {useNewUrlParser: true, useUnifiedTopology: true})
//     .then(() => 'You are now connected to Mongo!')
//     .catch(err => console.error('Something went wrong\n', err));
mongoose.connect('mongodb+srv://abhishekvtangod:abhi@2000@cluster0.9ugln.mongodb.net/node-blog?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong\n', err));


const mongoStore = connectMongo(expressSession);

app.use(expressSession({
    secret: 'fiscalsquid',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(connectFlash());

app.use(fileUpload());
app.use(express.static('public'));
app.use(engine);
app.set('views', `${__dirname}/views`);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('*', (req, res, next) => {
    edge.global('auth', req.session.username)
    next()
});


const auth = require("./middleware/auth");
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')
const redirectIfNotAuthenticated = require('./middleware/redirectIfNotAuthenticated')
const storePost = require('./middleware/storePost')

// app.use('/posts/store', storePost);

app.get('/', homePageController);
app.get('/post/:id', getPostController);
app.get('/posts/new',auth,  createPostController);
app.post('/posts/store',auth, storePost, storePostController);
app.get('/auth/login',redirectIfAuthenticated, loginController);
app.post('/users/login',redirectIfAuthenticated, loginUserController);
app.get('/auth/register',redirectIfAuthenticated, createUserController);
app.post('/users/register',redirectIfAuthenticated, storeUserController);
app.get("/auth/logout", redirectIfNotAuthenticated, logoutController);


app.listen(process.env.PORT || 4000, () => {
    console.log('App listening on port 4000')
});
