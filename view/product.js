const express = require('express')
const formidable = require('formidable')
const router = express.Router()
const fs = require('fs')
const productSchema = require('../model/product')
const product = require('../model/product')
const { ObjectId } = require('mongodb')

router.post("/uploadProducts",(req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    // console.log(form)
    form.parse(req, async (err,fields,file)=>{
        //   console.log(fields)
        // console.log(file)
        let fieldsObj = {
            Title : fields.Title[0],
            Price : fields.Price[0],
            Rating : fields.Rating[0],
            Description : fields.Description[0],
              Category: fields.Category[0]
        }
        if (err) {
            return res.status(400).json({
            error: err
            });
            }
       
        let product = new productSchema(fieldsObj)
        // console.log(file.Thumbnail[0].filepath)
        // console.log(product)
        let photoBuffer = fs.readFileSync(file.Thumbnail[0].filepath)
        let photoType = file.Thumbnail[0].mimetype
        product.Thumbnail.data = photoBuffer
        product.Thumbnail.contentType = photoType
        let result = await product.save()
        // console.log(product)
        return res.json({
        success : "Product uploaded successfully",
        result
    })
    })


})

router.get("/getProducts",async(req,res)=>{
    let result = await productSchema.find()
    return res.json({"message" : "data from backend",
        result
    })
})
router.delete("/deleteProduct/:id",async(req,res)=>{
    let {id} = req.params;
    let result = await productSchema.findOneAndDelete({ _id : new ObjectId(id)})
   return res.json({
        success : 'Product Deleted succesfully',
        result
    })
})
router.get("/getProduct/:id",async(req,res)=>{
    let {id} = req.params;
    let result = await productSchema.findOne({ _id : new ObjectId(id)})
   return res.json({
        success : 'Product details',
        result
    })
})
module.exports = router
