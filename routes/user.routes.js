const router = require("express").Router();
const userController = require("../controllers/user.controller");

router.post("/user/signup", userController.signup);
router.post("/user/login", userController.login);

router.delete(
  "/user/deleteUser/:id",
  userController.authenticateToken,
  userController.deleteUser
);

router.put(
  "/user/addTocart",
  userController.authenticateToken,
  userController.addTocart
);
router.put(
  "/user/confirm",
  userController.authenticateToken,
  userController.confirmbuy
);
module.exports = router;
