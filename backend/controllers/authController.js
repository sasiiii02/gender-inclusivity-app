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
