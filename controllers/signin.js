const handleSignin = (db, bcrypt, req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
      return Promise.reject('incorrect form submission');
    }
    return db.select('email', 'hash')
        .from('login')
        .where('email', '=', email)
        .then(user => {
            const isValid = bcrypt.compareSync(password, user[0].hash);
            if (isValid) {
                return db.select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then(user => user[0])
                    .catch(err => Promise.reject('Unable to get user'))
            } else {
                Promise.reject('Wrong credentials')
            }
        })
        .catch(err => res.status(400).json('Wrong credentials!'))
}

const getAuthTockenId = () => {
    console.log('Auth ok!');
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    return authorization ? 
        getAuthTockenId() : 
        handleSignin(db, bcrypt, req, res)
            .then(data => res.json(data))
            .catch(err => res.status(400).json(err))
}


module.exports = {
    signinAuthentication
  };