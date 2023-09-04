const Product = require("../models/product.model");
const User = require("../models/user.model");
const url = "mongodb://127.0.0.1:27017/ecommerce";
const mongoose = require("mongoose");

exports.getAllusers = async (req, res, next) => {
  await mongoose.connect(url);
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (user.isAdmin === "admin") {
      let allUsers = await User.find();
      res.json(allUsers);
    } else {
      res.json("you are not admin");
    }
  } catch {
    res.json("User not found");
  }
  mongoose.disconnect();
};

exports.deleteUser = async (req, res, next) => {
  await mongoose.connect(url);
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (user.isAdmin === "admin") {
      const deletedUser = await User.deleteOne({ _id: req.params.id });
      if (deletedUser.deletedCount === 1) {
        res.status(403).json("user deleted successfully");
      } else {
        res.status(404).json("User not found");
      }
    } else {
      res.status(403).json("You are not admin");
    }
  } catch (error) {
    res.status(500).json("Internal server error");
  } finally {
    mongoose.disconnect();
  }
};

exports.getAllproducts = async (req, res, next) => {
  await mongoose.connect(url);

  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (user.isAdmin === "admin") {
      let allProducts = await Product.find();
      res.json(allProducts);
    } else {
      res.json("you are not admin");
    }
  } catch {
    res.json("user not found");
  }
  mongoose.disconnect();
};

exports.addProduct = async (req, res, next) => {
  await mongoose.connect(url);
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (user.isAdmin === "admin") {
      await new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      }).save();
      res.json("Product added successfully");
    } else {
      res.json("you are not admin");
    }
  } catch {
    res.json("User not found");
  }
  mongoose.disconnect();
};

exports.updateProduct = async (req, res, next) => {
  await mongoose.connect(url);
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (user.isAdmin === "admin") {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      if (updatedProduct) {
        res.json("Product updated successfully");
      } else {
        res.status(404).json("Product not found");
      }
    } else {
      res.json("You are not admin");
    }
  } catch (error) {
    res.status(500).json("Internal server error");
  } finally {
    mongoose.disconnect();
  }
};

exports.deleteProduct = async (req, res, next) => {
  await mongoose.connect(url);
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (user.isAdmin === "admin") {
      const deletedProduct = await Product.deleteOne({ _id: req.params.id });
      if (deletedProduct.deletedCount === 1) {
        res.status(403).json("Product deleted successfully");
      } else {
        res.status(404).json("Product not found");
      }
    } else {
      res.status(403).json("You are not admin");
    }
  } catch (error) {
    res.status(500).json("Internal server error");
  } finally {
    mongoose.disconnect();
  }
};
