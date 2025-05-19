const express = require("express");
const formidable = require("formidable");
const router = express.Router();
const fs = require("fs");
const productSchema = require("../model/product");
const { ObjectId } = require("mongodb");

router.post("/uploadProducts", (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    const fieldsObj = {
      Title: fields.Title[0],
      Price: fields.Price[0],
      Rating: fields.Rating[0],
      Description: fields.Description[0],
      Category: fields.Category[0],
    };

    const product = new productSchema(fieldsObj);

    const photoBuffer = fs.readFileSync(file.Thumbnail[0].filepath);
    const photoType = file.Thumbnail[0].mimetype;

    product.Thumbnail.data = photoBuffer;
    product.Thumbnail.contentType = photoType;

    const result = await product.save();

    return res.json({
      success: "Product uploaded successfully",
      result,
    });
  });
});

router.get("/getProducts", async (req, res) => {
  const result = await productSchema.find();
  return res.json({ message: "Data from backend", result });
});

router.delete("/deleteProduct/:id", async (req, res) => {
  const { id } = req.params;
  const result = await productSchema.findOneAndDelete({
    _id: new ObjectId(id),
  });
  return res.json({
    success: "Product deleted successfully",
    result,
  });
});

router.get("/getProduct/:id", async (req, res) => {
  const { id } = req.params;
  const result = await productSchema.findOne({ _id: new ObjectId(id) });
  return res.json({
    success: "Product details",
    result,
  });
});

module.exports = router;
