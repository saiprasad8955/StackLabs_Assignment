const isValidAddress = function (value) {
    const regex = /[a-zA-Z]/;
    if (typeof value !== 'string') return false;
    if (regex.test(value) === false) return false;
    return true;
}

const isValidName = function (value) {
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(value)) {
        return false
    }
    return true;
}

const isValidEmail = function (value) {
    if (! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        return false
    }
    return true
}

const isValidNumber = function (value) {
    if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(value))) {

        return false
    }
    return true
}

const isValidPassword = function (value) {
    if (!(/^(?!\S*\s)(?=\D*\d)(?=.*[!@#$%^&*])(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z]).{8,15}$/.test(value))) {
        return false
    }
    return true
}


module.exports = {
    isValidAddress, isValidName, isValidEmail, isValidNumber, isValidPassword
}