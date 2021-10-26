const jwt = require('jsonwebtoken');

const config = require.main.require('./config');

module.exports = (
    req,
    res,
    next
) => {
    const {
        token
    } = req.headers;

    if(token) req.auth = jwt.verify(
        token,
        config.secret
    );

    next();
    return;
};