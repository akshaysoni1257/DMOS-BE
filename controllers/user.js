const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const adminUser = require("../models/client");
const customerUser =  require('../models/User');
//admin register
module.exports.adminregister = async (req, res) => {
    try {
      const isEmailTaken = req.body.email;
      const existingUser = await adminUser.findOne({ email: isEmailTaken });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" }); // Return a message if the user already exists
      }
      if (!req.body.password) {
        throw new Error("Password is required"); // Throw an error if password is not provided
      }
      const saltRounds = 10; // Define the number of salt rounds for bcrypt
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds); // Hash the password using bcrypt
  
      // Create a new admin user with the hashed password
      const newAdminUser = await adminUser.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword, // Store the hashed password in the database
        phone: req.body.phone,
        profile_picture: req.body.profile_picture,
        role:req.body.role
      });
      
      // Generate JWT token for the client
      const token = JWT.sign({ userId: newAdminUser._id }, "admin"); // Use newAdminUser._id to obtain the user ID
      
      // Update the new admin user with the token
      newAdminUser.token = token;
      await newAdminUser.save();
  
      return res.json({
        data: newAdminUser,
        message: "Admin registered successfully",
      });
    } catch (error) {
      throw new Error(error);
    }
};


//admin login
module.exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the provided email exists
    const existingUser = await adminUser.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Verify the JWT token obtained during registration against the stored token in the database
    const storedToken = existingUser.token; // Assuming token is stored in the 'token' field of the user document
    const decodedToken = JWT.verify(storedToken, "admin");
    // Check if the decoded token matches the user's ID
    if (decodedToken.userId !== existingUser._id.toString()) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // // Return the user data and a new JWT token for the authenticated user
    //   const token = JWT.sign({ userId: existingUser._id }, "admin", { expiresIn: "1h" });
     return res.json({
      data: existingUser,
      // token: token,
      message: "Admin logged in successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Forgot password
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user with the provided email exists
    const existingUser = await adminUser.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new password (you may want to send it via email or other means)
    const newPassword = generateNewPassword(); // You need to implement this function

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    existingUser.password = hashedPassword;
    await existingUser.save();

    return res.json({ message: "New password generated and updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Logout
module.exports.logout = async (req, res) => {
  try {
    // Destroy the session
    req.session.destroy(err => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Internal server error" });
      } else {
        return res.json({ message: "Logout successful" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Helper function to generate a new password
function generateNewPassword() {
  // Implement your logic to generate a new password (e.g., random string generation)
  return "newpassword123"; // Dummy password for demonstration purposes
}


//Customer Registration
module.exports.customerregister = async (req, res) => {
  try {
    const isEmailTaken = req.body.email;
    const existingUser = await customerUser.findOne({ email: isEmailTaken });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" }); // Return a message if the user already exists
    }
    if (!req.body.password) {
      throw new Error("Password is required"); // Throw an error if password is not provided
    }
    const saltRounds = 10; // Define the number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds); // Hash the password using bcrypt

    // Create a new admin user with the hashed password
    const newCustomerUser = await customerUser.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hashedPassword, // Store the hashed password in the database
      phone: req.body.phone,
      profile_picture: req.body.profile_picture,
    });
    
    // Generate JWT token for the client
    const token = JWT.sign({ userId: newCustomerUser._id }, process.env.JWT_SECRET);
    // Update the new admin user with the token
    newCustomerUser.token = token;
    await newCustomerUser.save();

    return res.json({
      data: newCustomerUser,
      message: "Customer registered successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
};

//Customer login
module.exports.customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the provided email exists
    const existingUser = await customerUser.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Verify the JWT token obtained during registration against the stored token in the database
    const storedToken = existingUser.token; // Assuming token is stored in the 'token' field of the user document
    const decodedToken = JWT.verify(storedToken,process.env.JWT_SECRET);
    // Check if the decoded token matches the user's ID
    if (decodedToken.userId !== existingUser._id.toString()) {
      return res.status(401).json({ message: "Invalid token" });
    }
     return res.json({
      data: existingUser,
      message: "Customer logged in successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
