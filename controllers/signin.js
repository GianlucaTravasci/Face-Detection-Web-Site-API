const jwt = require('jsonwebtoken');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL)

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
                    .then(person => person[0])
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

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'});
}

const setToken = (key, value) => {
    return Promise.resolve(redisClient.set(key, value));
}

const createSession = (user) => {
    //JWT token and save it
    const { email, id } = user;
    
    const token = signToken(email);

    return setToken(token, id).then(()=> {
        return {
            success: 'true', 
            userId: id, 
            token 
        }
    }).catch(console.log)
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    return authorization ? 
        getAuthTockenId() : 
        handleSignin(db, bcrypt, req, res)
            .then(data => {
                return data.id && data.email ? createSession(data) : Promise.reject('data');
            })
            .then(session => res.json(session))
            .catch(err => res.status(400).json(err))
}


module.exports = {
    signinAuthentication
  };