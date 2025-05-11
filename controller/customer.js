const usersSchema = require('../model/customer')
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken')

let signup =  async(req,res)=>{
    let {Password} = req.body
    let hashedPassword = bcrypt.hashSync(Password ,10)
    console.log(hashedPassword)
    req.body.Password = hashedPassword   
 let users = new usersSchema(req.body);
 let usersDetails = await users.save();
 return res.json({
    Success : "data stored successfully",
    usersDetails
 })

   console.log("testing")
 }

 let login =  async(req,res)=>{
    let {Email,Password} = req.body;
    
    let usersDetails = await usersSchema.findOne({Email : Email})
    if (usersDetails == null){
        return res.json({
            Message :" no users registered with this email"
        })
    }
    passwordResult = bcrypt.compareSync( Password , usersDetails.Password)
    console.log(passwordResult)
    if (passwordResult == false ){
        return res.json({
            Message :" wrong password "
        })
    }
      console.log(usersDetails)

      let token = jwt.sign({Email : usersDetails.Email , Role : usersDetails.Role},"shh")

    return res.json({Success : "Login success" , token, usersDetails})

 }
 
 let getUsers = async (req,res)=>{
    let users = await usersSchema.find();
    res.json(users)
 }


 module.exports = { signup,login,getUsers }