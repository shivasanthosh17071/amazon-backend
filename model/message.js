const express = require('express')
const mongoose = require('mongoose')


let usersSchema = new mongoose.Schema({
    Name : {
        type : String,
        required : true
    },
    Message : {
        type : String,
        required: true
    }

})

module.exports = mongoose.model("message", usersSchema)