import User from "../models/User.js";
import bcrypt from "bcryptjs"
import generateToken from "../utils/generateToken.js";


// register user

export const registerUser = async (req,res) => {
    try {
        const {name, email,password,role} = req.body;

        //check if user already exists
        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //create user
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role:role || "student",
        });

        //generate JWT

        const token = generateToken(user);

        res.status(201).json({
            message:"User registered successfully",
            token,
            user: {
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET PROFILE =================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update name if provided
    if (name && name.trim()) user.name = name.trim();

    // Handle password change (requires current password verification)
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to set a new password." });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect." });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    const saved = await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      user: { id: saved._id, name: saved.name, email: saved.email, role: saved.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
