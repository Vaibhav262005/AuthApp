//auth ,isStudent,isAdmin   
const jwt=require('jsonwebtoken');
require('dotenv').config();

exports.auth=(req,res,next)=>{
    try {
        //get the token from header
        const token= req.body.token || req.cookies.token || req.headers['authorization'].replace('Bearer ','');

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not found",
            });
        }
        try {
            //verify the token
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            console.log("Decoded token:",decoded);
            //add the user to request object
            req.user=decoded;
        } catch (error) {
            res.status(401).json({
                success:false,
                message:"Invalid token",
            });
            return;
        }
        next();

    } catch (error) {
        console.log("Error in auth middleware",error);
        res.status(401).json({
            success:false,
            message:"Unauthorized",
        });
    }
};


exports.isStudent=(req,res,next)=>{
    try {
        if(req.user.role !== 'Student'){
            return res.status(403).json({
                success:false,
                message:"This is a protected route for students only",
            });
        }
        next();
    } catch (error) {
        console.log("Error in isStudent middleware",error);
        res.status(500).json({
            success:false,
            message:"User role is not matching",
        });
    }
};

exports.isAdmin=(req,res,next)=>{
    try {
        if(req.user.role !== 'Admin'){
            return res.status(403).json({
                success:false,
                message:"This is a protected route for admin only",
            });
        }
        next();
    } catch (error) {
        console.log("Error in isAdmin middleware",error);
        res.status(500).json({
            success:false,
            message:"User role is not matching",
        });
    }
};