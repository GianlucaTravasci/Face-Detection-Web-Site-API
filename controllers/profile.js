const handleProfile = (req, res, db) => {
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
        .catch(err => res.status(404).json('Error getting user.'));
}

const handleProfileUpdate = (req, res, db) => {
    const { id } = req.params;
    const { name } = req.body;
    db('users')
        .where({ id })
        .update({ name })
        .then(resp => {
            if(resp) {
                res.status(200).json('success')
            } else {
                res.status(400).json('Unable to update')
            }
        })
        .catch(err => res.status(404).json('Error updating user.'));
}


module.exports = {
    handleProfile,
    handleProfileUpdate
}