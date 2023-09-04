const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const Product = require("../models/product.model");
const url = "mongodb://127.0.0.1:27017/ecommerce";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

exports.signup = async (req, res, next) => {
  await mongoose.connect(url);

  try {
    const { email, password, phoneNumber, firstNamed, lastNamed } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("Email already exists");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json("Invalid email format");
    }

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json(
          "password should be at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character"
        );
    }

    const phoneNumberRegex = /^01[0125][0-9]{8}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      return res.status(400).json("Invalid phone number format");
    }

    const nameRegex = /^[a-zA-Z]{3,}$/;
    if (!nameRegex.test(firstNamed) || !nameRegex.test(lastNamed)) {
      return res
        .status(400)
        .json(
          "First name and last name must be at least 3 characters and cant contain numbers"
        );
    }

    const hashedPass = await bcrypt.hash(password, 10);
    req.body.password = hashedPass;
    await new User(req.body).save();

    res.json("user added");
  } catch (error) {
    res.status(500).json("Internal server error");
  } finally {
    mongoose.disconnect();
  }
};

exports.login = async (req, res, next) => {
  try {
    await mongoose.connect(url);

    let found = await User.findOne({
      email: req.body.email,
    });
    console.log(found);
    if (found) {
      const isMatch = await bcrypt.compare(req.body.password, found.password);
      if (isMatch) {
        const userId = found.id;
        const accessToken = generateAccessToken({ userId });
        res.json({ message: "logged in", token: accessToken });
      } else res.json("password did not match");
    } else res.json("user not found");
  } catch (e) {
    res.status(403).send("error in login");
  }
  mongoose.disconnect();
};

exports.deleteUser = async (req, res, next) => {
  await mongoose.connect(url);
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (user._id.toString() === req.params.id) {
      const deletedUser = await User.deleteOne({ _id: req.params.id });
      if (deletedUser.deletedCount === 1) {
        res.status(403).json("your account has been deleted");
      } else {
        res.status(404).json("User not found");
      }
    } else {
      res.status(403).json("you are not authorized to delete any user but you");
    }
  } catch (error) {
    res.status(500).json("Internal server error");
  } finally {
    mongoose.disconnect();
  }
};

exports.addTocart = async (req, res, next) => {
  await mongoose.connect(url);
  let products = await Product.find();
  let flag = 0;
  let arr = req.body.cart;
  for (const product of products) {
    if (arr.includes(product.name)) {
      flag++;
    }
  }
  if (flag === arr.length) {
    let user = await User.findOne({ _id: req.user.userId });
    if (user) {
      if (user.cart) {
        let oldCart = [...user.cart];

        await User.updateOne(
          { _id: req.user.userId },
          { cart: oldCart.concat(req.body.cart) }
        );
      } else {
        await User.updateOne(
          { _id: req.user.userId },
          { cart: [...req.body.cart] }
        );
      }

      res.json("product added to the cart");
    }
  } else {
    res.json("product not found");
  }

  mongoose.disconnect();
};

exports.confirmbuy = async (req, res, next) => {
  try {
    await mongoose.connect(url);

    const act = req.body.confirmation;

    if (act == "cancel") {
      await User.findOneAndUpdate({ _id: req.user.userId }, { cart: [] });
      res.json("purchase cancelled");
    } else if (act == "buy") {
      const user = await User.findOne({ _id: req.user.userId });
      const cartItems = user.cart;

      for (const itemName of cartItems) {
        await Product.deleteOne({ name: itemName });
      }

      await User.findOneAndUpdate({ _id: req.user.userId }, { cart: [] });
      res.json("Purchase completed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  } finally {
    mongoose.disconnect();
  }
};

function generateAccessToken(user) {
  return jwt.sign(user, "secret123", {
    expiresIn: "1h",
  });
}

exports.authenticateToken = function (req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "secret123", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
