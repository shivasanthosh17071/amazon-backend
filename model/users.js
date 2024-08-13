// const express = require ('express')
// const mongoose = require ( 'mongoose')

// let userSchema = new mongoose.Schema({
//    Name : {type : String,
//             required :true
//         },
        // Email : {type : String,
        //     required :true
        // }, 
//         Phone : {type : Number ,
//             required :true
//         },
//         Password : {type : Number ,
//             required :true
//         }
//     })

// module.exports = mongoose.model("accountDetails",userSchema)




const express = require('express')
const mongoose = require('mongoose')


let usersSchema = new mongoose.Schema({
    Name : {type : String,
        required :true
    },
    Phone :{
        type : String ,
        required :true
    }
})

module.exports = mongoose.model('data',usersSchema)