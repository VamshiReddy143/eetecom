const cloudinary = require('cloudinary').v2;
const productModel = require('../models/product.model');
const dotenv = require('dotenv');
dotenv.config();

// Cloudinary configuration
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_SECRET } = process.env;
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_CLOUD_SECRET,
  secure: true,
});

// Add Product
const ADD_PRODUCT = async (req, res) => {
  try {
    const { title, image, price, description, brand, model, color, category, discount } = req.body;

    // Validate required fields
    if (!title || !price || !description || !brand || !model || !color || !category || !discount) {
      return res.status(400).json({
        message: 'All fields are required except image',
        received: req.body,
      });
    }

    let imageData = {
      public_id: null,
      url: null,
    };

    // Upload image to Cloudinary if provided
    if (image && image.startsWith('data:image')) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: 'products',
        });
        imageData = {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        };
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        return res.status(500).json({
          message: 'Error uploading image to Cloudinary',
          error: uploadError.message,
        });
      }
    } else if (image) {
      // If image is already a Cloudinary URL (from edit)
      imageData.url = image;
    }

    // Create product
    const product = new productModel({
      title,
      image: imageData.url,
      price,
      description,
      brand,
      model,
      color,
      category,
      discount,
    });

    await product.save();

    return res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({
      message: 'Error adding product',
      error: error.message,
    });
  }
};

// Update Product
const UPDATE_PRODUCT = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, price, description, brand, model, color, category, discount } = req.body;

    // Validate required fields
    if (!title || !price || !description || !brand || !model || !color || !category || !discount) {
      return res.status(400).json({
        message: 'All fields are required except image',
        received: req.body,
      });
    }

    let imageData = {
      public_id: null,
      url: image,
    };

    // Upload new image to Cloudinary if provided and is base64
    if (image && image.startsWith('data:image')) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: 'products',
        });
        imageData = {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        };
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        return res.status(500).json({
          message: 'Error uploading image to Cloudinary',
          error: uploadError.message,
        });
      }
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        title,
        image: imageData.url,
        price,
        description,
        brand,
        model,
        color,
        category,
        discount,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      message: 'Error updating product',
      error: error.message,
    });
  }
};

// Delete Product
const DELETE_PRODUCT = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Optionally delete image from Cloudinary if it exists
    if (product.image) {
      try {
        const publicId = product.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (uploadError) {
        console.error('Cloudinary Delete Error:', uploadError);
      }
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      message: 'Error deleting product',
      error: error.message,
    });
  }
};

// Get all products
const GET_PRODUCTS = async (req, res) => {
  try {
    const { category, brand, page = 1, limit = 10 } = req.query;

    const query = {};
    if (category) query.category = category;
    if (brand) query.brand = brand;

    const skip = (page - 1) * limit;

    const products = await productModel.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await productModel.countDocuments(query);

    return res.status(200).json({
      message: 'Products retrieved successfully',
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

module.exports = {
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCTS,
};