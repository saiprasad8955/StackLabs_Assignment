const jwt = require('jsonwebtoken')

// AUTHENTICATION
const authentication = async (req, res, next) => {
    try {

        let token1 = req.headers['authorization'];
        if (!token1) {
            return res.status(401).send({ status: false, msg: "Authentication token is required" })
        } else {
            let token = token1.split(' ')[1];

            // Now Verify that token in Decoded Token
            jwt.verify(token, "$2b$10$Dx.w8Mt.uqF5y78DHE1Ya", { ignoreExpiration: true }, function (err, decoded) {
                if (err) {
                    return res.status(400).send({ status: false, meessage: "token invalid" })
                }
                else {
                    if (Date.now() > decoded.exp * 1000) {
                        return res.status(401).send({ status: false, msg: "Session Expired", });
                    }

                    // Store Decoded Token User Id into request header named as userId
                    req.userId = decoded.userId;

                    // Now Simply Next the flow 
                    next();
                }
            });
        }
    }
    catch (err) {
        console.log("Error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
};


module.exports = { authentication }