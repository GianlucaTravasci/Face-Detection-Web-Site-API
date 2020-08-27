const express = require('express');

const app = express();

app.use(express.json()); //for parse the email

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: '12345',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: '54321',
            entries: 0,
            joined: new Date()
        }
    ]
}

const port = 3000;

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json('success');
    } else {
        res.status(400).json('error logging in')
    }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    database.users.push({
        id: '125',
        name,
        email,
        password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})

/*
/signin route --> POST = success/fail   DONE
/segister --> POST = user               DONE
/profile/:id --> GET = user             
/image --> PUT = user.rank
*/