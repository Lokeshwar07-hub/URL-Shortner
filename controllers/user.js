const User = require("../models/user");
const { setUser } = require("../services/auth");

async function handleuserSignup(req, res) {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
        return res.render("signup", { error: "Email already registered. Please login." });
    }

    await User.create({ name, email, password });
    return res.redirect("/login");
}

async function handleuserLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.render("login", {
            error: "Invalid email or password.",
        });
    }

    const token = setUser(user);
    res.cookie("uid", token, { httpOnly: true });
    return res.redirect("/");
}

async function handleuserLogout(req, res) {
    res.clearCookie("uid");
    return res.redirect("/login");
}

module.exports = { handleuserSignup, handleuserLogin, handleuserLogout };