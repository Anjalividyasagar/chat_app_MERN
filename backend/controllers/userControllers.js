const asyncHandler=require("express-async-handler");
const User=require('../models/userModel');
const generateToken=require("../config/generateToken");

const registerUser =asyncHandler(async (req,res)=>{
   const{name,email,password,pic} =req.body;

   if(!name||!email||!password){
    res.status(400);
    throw new Error("please enter all the feilds");
   }
   const userExists=await User.findOne({email});
   if(userExists){
    res.status(400);
    throw new Error("User already exists");
   }

   const user =await User.create({
    name,
    email,
    password,
    pic,
   });

   if(user){
    res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token:generateToken(user._id),
    });
   }
   else{
    res.status(400);
    throw new Error(" Failed TO Create User");
   }

});

const authUser=asyncHandler(async(req,res)=>{
    const{ email,password}=req.body;
    const user=await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        res.json(
            {
                 _id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token:generateToken(user._id),

            }

        ); 
        
    }
        else{
            res.status(401);
            throw new Error("Invalid Email or Password");
        }
    
});

const allUsers=asyncHandler(async(req,res)=>{
    const keyword=req.query.search 
    const regex = new RegExp("^" + keyword);
    console.log(keyword)
    const key={$or:[{name:regex},{email:regex}]}
    const users = await (await User.find(key).find({_id:{$ne:req.user._id}}));
 //const users = await User.find({ name:regex });
 res.send(users);
});

module.exports= {registerUser,authUser,allUsers};