const express = require("express");
const router = express.Router();
const { handleuserSignup, handleuserLogin, handleuserLogout } = require("../controllers/user");

router.post("/", handleuserSignup);
router.post("/login", handleuserLogin);
router.get("/logout", handleuserLogout);

module.exports = router;