import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import TryCatch from "../utils/tryCatch.js";
import generateToken from "../utils/generateToken.js";

//signin
export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password } = req.body;

    //verifying if user exists for current email or not

    let user = await User.findOne({ email });
    if (user)
        return res.status(400).json({
            message: "Already have an account with this email",
        });

    //if user not found then we have to crate a new user and we also have to hash the password also beacuse we can't let out password as plain text
    const hashPassword = await bcrypt.hash(password, 10); // bcrypt returns promise

    user = await User.create({
        name,
        email,
        password: hashPassword,
    });
    generateToken(user._id,res)
    res.status(201).json({
        user,
        message: "User registered",
    });
});

//login
export const loginUser = TryCatch(async (req, res) => {
    const {email,password}=req.body;

    //finduser
    const user=await User.findOne({email})
    
    if(!user) //if user dont exist
        return res.status(400).json({
            message:"No user with this email"
        })

    //if userexits we compare passwords
    const comaprePassword =await bcrypt.compare(password,user.password)

    if(!comaprePassword) return res.status(400).json({
        message:"wrong password"
    })
    generateToken(user._id,res)

    res.json({
        user,
        message:"logged in",
    })
});


//for fetching profile

export const myProfile= TryCatch(async(req,res)=>{
    const user=await User.findById(req.user._id)
    res.json(user)
})

//for fetching other profile

export const userProfile= TryCatch(async(req,res)=>{
    const user =await User.findById(req.params.id).select("-password")
    res.json(user)
})

//follow and unfollow

export const followAndUnfolloUser= TryCatch(async(req,res)=>{
    const user=await User.findById(req.params.id) //thisis the user we want to follow we get his id by req.params.id
    const loggedInUser=await User.findById(req.user._id) //this is us or the One who want to follow
    
    //we we dont have any user who we want to follow
    if(!user)return res.status(400).json({
        message:"no user with this id"
    });

    //checking that we cant follow ourself
    if(user._id.toString()===loggedInUser._id.toString()) return res.status(400).json({message:"you cant follow yourself"})

    
    //checking if we already following the user.. do we have our id in the user's followers array
    if(user.followers.includes(loggedInUser._id)){//if yes the we firstfind index and then delete it(unfolllow it)
        const indexFollowing=loggedInUser.followings.indexOf(user._id) //we got the index of the One who we are following uaki is hamare following m hogi cause we follow him
        const indexFollowers=user.followers.indexOf(loggedInUser._id);// we got the index of ourself 

        loggedInUser.followings.splice(indexFollowers,1)  //loggedin user mtlb we ki followings ki array se user ki id splice karenge
        user.followers.splice(indexFollowers,1); //user ki followers m se khud ko hata denge apni index

        await loggedInUser.save()
        await user.save()

        res.json({
            message:"User Unfollowed"
        })
    }else{       // if we are not following the user
        loggedInUser.followings.push(user._id);
        user.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await user.save();

        res.json({
            message:"user Followed"
        })
    } })
//user Logout
export const logOutUser= TryCatch(async(req,res)=>{
    res.cookie("token","",{maxAge:0});
    res.json({message:"logout Successfully"})
}) 

