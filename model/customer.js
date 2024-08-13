const express = require('express')
const mongoose = require('mongoose')

let usersSchema = new mongoose.Schema({
    Name : {
        type : String,
        // required : true
    },
    Email : {
        type : String,
        // required : true
    },
    PhoneNumber : {
        type : Number,
        // required : true
    },
    Role : {
        type : Number,
        // required : true
    },
    Password : {
        type : String,
        // required : true
    },
    Age : {
        type : String,
        // required : true
    },
    Address : {
        type : String,
        // required : true
    },
    Gender : {
        type : String,
        // required : true
    }
})

module.exports = mongoose.model("login",usersSchema )
