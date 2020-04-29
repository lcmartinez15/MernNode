const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
    // get token from header
    console.log("validacion de token " + req);
    const token = req.header("x-auth-token");

    console.log("token " + token);
    //Check if not token
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    //Verify token
    try {
        console.log("decode de token");
        const decoded = jwt.verify(token, config.get("jwtSecret"));

        req.user = decoded.user;
        console.log("decode user" + decoded.user.id);
        next();
    } catch (error) {
        res.status(401).json({ msg: "Token is not vlid " });
    }
};