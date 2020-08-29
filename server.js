const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'Gianluca.96',
      database : 'facedetection'
    }
});

const app = express();

app.use(express.json()); //for parse the email
app.use(cors());


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

app.put('/image', (req, res) => {
    image.handleImage(req, res, db);
})

app.post('/imageUrl', (req, res) => {
    image.handleApiCall(req, res);
})

app.listen(portEnv || portFail, () => {
    console.log(`Server running on http://localhost:${portEnv}`);
})
