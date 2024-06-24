const User = require('../models/userShema');
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const client = require('../twilio')
// Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, confirm_password } = req.body;
        const file = req.file.filename;

        if (password !== confirm_password) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: "Email or phone number already exists" });
        }

        const newUser = new User({ name, email, phone, password, confirm_password, photo: file });

        await newUser.save();

        res.status(201).json({ user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

// Login User and send OTP
exports.loginUser = async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(422).json({ error: "Please provide both phone and password" });
    }

    try {
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(422).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(422).json({ error: "Invalid credentials" });
        }

        // Send OTP 
        const verification = await client.verify.v2.services("VAe1553476ef6307b402fee15c8a7f62b4")
            .verifications
            .create({ to: `+91${phone}`, channel: 'sms' });

        res.status(200).json({ message: "OTP sent to your phone", sid: verification.sid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Verify OTP and log in
exports.verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(422).json({ error: "Please provide both phone and OTP" });
    }

    try {
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify OTP
        const verificationCheck = await client.verify.v2.services("VAe1553476ef6307b402fee15c8a7f62b4")
            .verificationChecks
            .create({ to: `+91${phone}`, code: otp });

        if (verificationCheck.status !== 'approved') {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // OTP is valid, generate JWT token
        const token = jwt.sign({ userId: user._id }, 'SECRET123', {
            expiresIn: '1h'
        });

        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000),
        });

        res.status(200).json({ status: 200, result: { user, token } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



exports.getDashboard = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'SECRET123');

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};


exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, password, confirm_password } = req.body;
    const file = req.file ? req.file.filename : req.body.photo;
  
    try {
      console.log(req.body);
      console.log("Uploaded File:", req.file);
  
      const updateUser = await User.findByIdAndUpdate(
        id,
        {
          name,
          email,
          phone,
          password,
          confirm_password,
          photo: file
        },
        {
          new: true
        }
      );
  
      if (!updateUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      res.status(200).json(updateUser);
    } catch (error) {
      console.error('Update Error:', error.message);
      res.status(500).json({ msg: 'Server Error', error });
    }
  };



exports.logoutUser = async(req,res,next) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
        });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
} 

