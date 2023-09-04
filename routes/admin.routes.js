const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const userController = require("../controllers/user.controller");
const productController = require("../controllers/admin.controller");


router.get(
  "/admin/getAllusers",
  userController.authenticateToken,
  adminController.getAllusers
);
router.delete(
  "/admin/deleteUser/:id",
  userController.authenticateToken,
  adminController.deleteUser
);


router.get(
  "/admin/getAllproducts",
  userController.authenticateToken,
  productController.getAllproducts
);
router.post(
  "/admin/addProduct",
  userController.authenticateToken,
  productController.addProduct
);
router.put(
  "/admin/updateProduct/:id",
  userController.authenticateToken,
  productController.updateProduct
);
router.delete(
  "/admin/deleteProduct/:id",
  userController.authenticateToken,
  productController.deleteProduct
);


module.exports = router;
