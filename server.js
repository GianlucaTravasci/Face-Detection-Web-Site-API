const express = require('express');
var cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
var knex = require('knex');
const { response } = require('express');

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


const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash')
        .from('login')
        .where('email', '=', req.body.email)
        .then(user => {
            const isValid = bcrypt.compareSync(req.body.password, user[0].hash);
            if (isValid) {
                return db.select('*')
                    .from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Wrong credentials')
            }
        })
        .catch(err => res.status(400).json('Wrong credentials!'))
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;

    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return db('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name,
                        joined: new Date()
                    })
                    .then(user =>{
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*')
        .from('users')
        .where({ id })
        .then(user =>{
            if(user.length) {
                res.json(user[0])
            } else {
                res.status(404).json('Not found!')
            }
        })
        .catch(err => res.status(404).json('Error getting user.'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users')
        .where('id', "=", id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to get entries'))
})


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})