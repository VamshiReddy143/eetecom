const express = require("express")
const { ADD_PRODUCT, GET_PRODUCTS, DELETE_PRODUCT, UPDATE_PRODUCT } = require("../controllers/product.controller")
const router = express.Router()


router.post("/create",ADD_PRODUCT)
router.get("/",GET_PRODUCTS)
router.delete("/:id",DELETE_PRODUCT)
router.put("/:id",UPDATE_PRODUCT)


module.exports = router