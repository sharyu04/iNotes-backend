const express = require('express');
const User  = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchUser');

const JWT_Secret = 'heyThere';


//Create a user using: POST: "/api/auth/createUser"
router.post('/createUser',[
    body('name').isLength({ min: 1 }),
    body('email','Enter a valid email').isEmail(),
    body('password').isLength({ min: 5 }),
],async(req,res)=>{
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        //Check whether the email user already exists
        let user = await User.findOne({email : req.body.email});
        if(user){
            return res.status(400).json({success ,error : "User with this email already exists"})
        }
        
        //Create user
        const salt = await bcrypt.genSalt();
        const secPass = await bcrypt.hash(req.body.password,salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
          });
        
          const data = {
            user: {
                id: user.id
            }
          }
          const authtoken = jwt.sign(data, JWT_Secret);

        success = true;
        res.json({success, authtoken})  
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured")
    }

      
    //   .then(user => res.json(user))
    //   .catch(err => {console.log(err)
    //   res.json({error: 'Please enter a unique email', message: err.message})}
    //   )
})

//Authenticate a user using: POST: "/api/auth/login"
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be empty').exists(),
],async(req,res)=>{ 
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Please try again with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({error: "Please try again with correct credentials"});
        }

        const data = {
            user: {
                id: user.id
            }
          }
          const authtoken = jwt.sign(data, JWT_Secret);

        success = true;
        res.json({success,authtoken}) 

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured")
    }
} )



//Get logged in user details using : POST: "/api/auth/getUser". Login user
router.post('/getUser', fetchuser, async(req,res)=>{
    
    try{
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    }catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured")
    }
})


module.exports = router