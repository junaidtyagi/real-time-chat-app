const jwt = require('jsonwebtoken');

module.exports = async(req, res, next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token , process.env.SECRET_KEY);
        req.body.userId= decodedToken.userId;
        next();
    } catch (error) {
        res.status(400).json({
            status:"failled",
            message:error.message
        })
    }
}