const express = require("express");
const { authenticateViaEmail } = require("../controllers/authController");
const router = express.Router();
const {signUp, login, logOut} = require("../controllers/entryController");

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/logout", logOut);
router.post("/verify/:id", authenticateViaEmail);

// for test jwt verification
// router.get("/protect", verifyJWT, (req, res) => res.send({"protect": "true"}));

module.exports = router;