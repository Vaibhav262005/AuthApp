const express = require('express');
const router = express.Router();

const {login,signup}=require('../controllers/auth');
const {auth,isStudent,isAdmin}=require('../middlewares/auth');

router.post('/login',login);
router.post('/signup',signup);

//protected route
router.get('/test',auth,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"You are in protected route for testing",
        user:req.user,
    });
});

//student route
router.get('/student',auth,isStudent,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"You are in student route",
        // user:req.user,
    });
});

//admin route
router.get('/admin',auth,isAdmin,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"You are in admin route",
        // user:req.user,
    });
});


router.get('getEmail',auth,(req,res)=>{
    const id=req.user.id;
    console.log(id);
    res.send("done"); 
});
module.exports=router;  
