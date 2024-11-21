import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token; //toread this cookie we have to install a package 
        if (!token) return res.status(403).json({ message: "Please Login" });

        //decode
        const decodedData = jwt.verify(token, process.env.JWT_SEC);

        if (!decodedData)
            return res.status(403).json({ message: "token expired" });
        //now we can easiy find user with decoded data
        req.user =await User.findById(decodedData.id) //req.user._id
        next();
    } catch (error) {
        res.status(500).json({ message: "Please Login" });
    }
};
