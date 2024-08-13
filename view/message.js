const express = require('express')
const Router = express.Router()
const usersSchema = require('../model/message')
const message = require('../model/message')
const { ObjectId } = require('mongodb')

Router.post('/sendMsg', async (req,res)=>{
    let message = new usersSchema(req.body)
    let data = await message.save()
    return res.json({message : " message sent",
        data
    })  
})
Router.get('/getMsg', async (req,res)=>{
    let data = await usersSchema.find()
    res.json({
        "message": "received",
        data
    })
})
Router.delete('/deleteMsg/:msgId',async (req,res)=>{
let {msgId} = req.params
    let result = await usersSchema.findByIdAndDelete({ _id : new ObjectId(msgId)})
    return res.json({"message" : " deleted succesfully ",
    result
 })
})

module.exports = Router