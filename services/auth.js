const jwt = require("jsonwebtoken");

const secret = "lokeshwar1212@$";

function setUser(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
        },
        secret,
        { expiresIn: "7d" }
    );
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}

module.exports = { setUser, getUser };