const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET; 

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Access Denied' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user;  
        next();
    });
};

module.exports = authenticateJWT;
