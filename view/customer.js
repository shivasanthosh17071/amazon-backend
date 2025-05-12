const express = require('express')
const CustomerRouter = express.Router()
const usersSchema = require('../model/customer')
const {signup,login ,getUsers} = require('../controller/customer')
const jwt = require('jsonwebtoken')

CustomerRouter.post('/signup', signup )
CustomerRouter.post( '/login' , login )

// CustomerRouter.get('/getUsers', (req,res,next)=>{
//    let token = (req.headers.authorization)
//    if(!token){
//     res.json({Message :" Token is required"})
//    }
  
//    try{ let result = jwt.verify( token, "shh")
//     console.log(result)
//     if(result.Role == 1 ){
//     next(); 
//     } else{
//     return res.json({
//         message : " You are not a Admin ,only admins can access"
//     })
//     }
   
//      } catch(err){
//     res.json(err);
//    }
 
//     return console.log("testing")
// } , getUsers )
CustomerRouter.get("/getUsers", getUsers);

module.exports= CustomerRouter
