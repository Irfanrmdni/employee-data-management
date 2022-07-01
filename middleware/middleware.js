const crypto = require('crypto');

//? membuat hash password
const getHashPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

//? membuat auth token
const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

//? middleware untuk semua halaman
const requireAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.render('login', {
            layout: 'layouts/mainLayout',
            title: 'Login Account'
        });
    }
};

module.exports = {
    getHashPassword,
    generateAuthToken,
    requireAuth,
}