const express = require('express')
const Router = express.Router()
const usersSchema = require('../model/users')
const {ObjectId}= require('mongodb')

Router.get('/getUsers',async (req,res)=>{
    let users = await usersSchema.find();
    res.json(users)
})
Router.get('/getAUsers/:id',async (req,res)=>{
    const {id}= req.params
    let users = await usersSchema.findOne({ _id : new Object(id)});
  return   res.json(users)
})
Router.put('/updateUsers/:id',async (req,res)=>{
    const {id}= req.params
    let users = await usersSchema.findOneAndUpdate({ _id : new Object(id)},req.body );
  return   res.json(users)
})
Router.get('/deleteUsers/:id',async (req,res)=>{
    const {id}= req.params
    let users = await usersSchema.findOneAndDelete({ _id : new Object(id)} );
  return   res.json(users)
})
Router.get('/home', async (req,res)=>{
   let users = new usersSchema(req.body)
   let usersDetails = await users.save()
   res.send({
    'message': "stored data", 
    usersDetails}
   )
})

module.exports= Router