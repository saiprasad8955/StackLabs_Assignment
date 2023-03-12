const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
var firebaseAdmin = require('../firebase/firebase');
const { isValidPassword, isValidEmail, isValidName, isValidAddress, isValidNumber } = require('../validations/validation');


//------------------ Register USER   
module.exports.register = async (req, res) => {

    try {

        const { email, password, name, phone, address, displayName } = req.body;

        // check for existing email
        const existingEmail = await userModel.findOne({ email: email })
        if (existingEmail) {
            return res.status(409).send({ status: false, message: 'Email Already exists.. Try Another!!' })
        }

        // Validate Email
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: 'Email is invalid!!' })
        }

        // Validate Password
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: 'Password is invalid!!' })
        }

        // Validate Name
        if (!isValidName(name)) {
            return res.status(400).send({ status: false, message: 'Name is invalid!!' })
        }

        // check for existing Phone
        const existingPhone = await userModel.findOne({ phone: phone })
        if (existingPhone) {
            return res.status(409).send({ status: false, message: 'Phone Number Already exists.. Try Another!!' })
        }

        // Validate Phone
        if (!isValidNumber(phone)) {
            return res.status(400).send({ status: false, message: 'Phone Number is invalid!!' })
        }

        // Validate Address

        if (!isValidAddress(address)) {
            return res.status(400).send({ status: false, message: 'Address is invalid!!' })
        }



        // Create a new user in Firebase Authentication
        const { uid } = await firebaseAdmin.auth().createUser({
            email,
            password,
            displayName: name,
        })


        const data = {
            email,
            password,
            name,
            phone,
            address,
            firebaseUid: uid
        }

        const user = await userModel.create(data);
        return res.status(201).send({ status: true, message: 'User registered successfully.', data: user });

    } catch (error) {
        console.error(error);

        if (error.code === 'auth/email-already-exists') {
            // Handle the case where the email address is already in use
            res.status(409).send('Email address is already in use');
        } else {
            // Handle other errors
            console.error(error);
            return res.status(500).json({ message: 'Internal server error in register User route..' });
        }
    }
}

//------------------ USER LOGIN   
module.exports.loginUser = async (req, resp) => {

    try {

        // Extract data from RequestBody
        let data = req.body

        // Extract Email And Password
        const { values, res } = data
        const { email, pass } = values

        // Validate Email
        if (!isValidEmail(email)) {
            resp.status(400).send({ status: false, message: 'Email is invalid' })
            return
        }

        // Validate password
        if (!isValidPassword(pass)) {
            resp.status(400).send({ status: false, message: 'It is not valid password' })
            return
        }

        // Check Email and password is Present in DB  
        let user = await userModel.findOne({ email: email, password: pass })

        if (!user) {
            return resp.status(401).send({ status: false, msg: "Email or password does not match, Invalid login Credentials" })
        }

        // Generate Token 
        let token = jwt.sign(
            {
                userId: user._id.toString(),
                uid: res.user.uid,
                iat: new Date().getTime() / 1000,
            },
            "$2b$10$Dx.w8Mt.uqF5y78DHE1Ya", { expiresIn: "1h" }
        )

        // send response to  user that Author is successfully logged in
        resp.status(200).send({ status: true, message: "User login successfull", data: { userId: user._id, token: token } })


    }
    catch (error) {
        resp.status(500).send({ status: false, msg: error.message });
    }
};

//------------------ All USER Details  
module.exports.users = async (req, res) => {

    try {
        const users = await userModel.find();
        return res.status(200).send({ status: true, msg: "User Details Fetched Successfully", data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error in fetchUsers Route...' });
    }
}

//------------------ Get USER Profile 
module.exports.userProfile = async (req, res) => {
    try {

        // extract UserId
        const userId = req.params.userId

        //Find by Id
        const user = await userModel.findById(userId);
        return res.status(200).send({ status: true, msg: "User Details Fetched Successfully", data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};