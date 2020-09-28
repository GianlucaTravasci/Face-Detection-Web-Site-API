const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DB_URI,
        /*ssl: {
            rejectUnauthorized: false
          }
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME*/
    }
});

const app = express();

app.use(express.json()); //for parse the email
app.use(cors());
app.use(morgan('combined'));

const portEnv = process.env.PORT;
const portFail = 3000;

app.get('/', (req, res) => {
    res.send('it is working!');
})

app.post('/signin', (req, res) => {
    signin.handleSignin(req, res, db, bcrypt);
})

app.post('/register', (req, res) => {
    register.handleRegister(req, res, db, bcrypt);
});
  

app.get('/profile/:id', (req, res) => {
    profile.handleProfile(req, res, db);
})

app.post('/profile/:id', (req, res) => {
    profile.handleProfileUpdate(req, res, db);
})

app.put('/image', (req, res) => {
    image.handleImage(req, res, db);
})

app.post('/imageUrl', (req, res) => {
    image.handleApiCall(req, res);
})

app.listen(portEnv || portFail, () => {
    console.log(`Server running on http://localhost:${portEnv ? portEnv : portFail}`);
})
