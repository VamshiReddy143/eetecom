const express = require("express")
const { ADD_TO_CART } = require("../controllers/product.controller")
const router = express.Router()


router.post("/add",ADD_TO_CART)


module.exports = router