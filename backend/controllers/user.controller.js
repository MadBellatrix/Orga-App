import User from "../models/User.js";

export const createUser = async (req, res) => {
    try {
    
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server error!"})
    }
};
