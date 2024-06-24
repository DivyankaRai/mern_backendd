const express = require('express')
const router = new express.Router()
const usercontroller = require('../controller/userController')
const upload = require("../multerconfig/storageconfig")

// user routes
router.post("/register",upload.single("photo"),usercontroller.registerUser)
router.post("/login", usercontroller.loginUser)
router.get("/dashboard", usercontroller.getDashboard)
router.patch('/update/:id', upload.single('photo'),usercontroller.updateUser);
router.get("/logout", usercontroller.logoutUser)
router.post('/verify-otp', usercontroller.verifyOtp);

module.exports = router;
