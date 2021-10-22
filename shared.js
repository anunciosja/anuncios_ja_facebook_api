const jwt = require('jsonwebtoken');

module.exports = { 
    protectRoutes : (req, res, next) => {
        const token = req.body.token || req.params.token || req.headers['x-access-token'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ success: false, message: 'Falha ao autenticar o token de segurança.' });
                }
                else {
                    // if everything is good, save to request for use in other routes
                    req.auth = decoded;
                    next();
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
};