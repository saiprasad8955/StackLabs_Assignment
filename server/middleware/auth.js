const jwt = require('jsonwebtoken')

const admin = require('../firebase/firebase')

// AUTHENTICATION
const authentication = async (req, res, next) => {
    try {


        let token1 = req.headers['authorization'];
        if (!token1) {
            return res.status(401).send({ status: false, msg: "Authentication token is required" })
        } else {
            let token = token1.split(' ')[1];

            // Now Verify that token in Decoded Token
            jwt.verify(token, process.env.SECRET_KEY, { ignoreExpiration: true }, function (err, decoded) {
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


const firebaseAuth = async (req, res, next) => {

    try {

        const idToken = req.body.values.token
        admin.auth()
            .verifyIdToken(idToken)
            .then((decodedToken) => {
                const uid = decodedToken.uid;
                req.uid = uid;
                next();
            })
            .catch((error) => {
                res.status(500).send({ status: true, msg: `Firebase Admin Authentication error: ${error}` })
            });


    } catch (err) {
        // Handle other errors
        console.error(err);
        return res.status(500).json({ message: 'Internal server error in register User route..' });
    }

}
module.exports = { authentication, firebaseAuth }