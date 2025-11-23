require('dotenv').config();
const crypto = require('crypto');

function hash(plainTextPassword, salt) {
    // Create a hash using SHA-256 with the salt
    const hash = crypto.createHmac('sha256', salt);
    hash.update(plainTextPassword);
    return hash.digest('hex');
}

function compare(plainTextPassword, hashedPassword, salt) {
    const hashedInput = hash(plainTextPassword, salt);
    return hashedInput === hashedPassword;
}

module.exports = {
    hash,
    compare
}