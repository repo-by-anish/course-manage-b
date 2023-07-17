const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");

router.route("/")
  .post(adminController.createAdmin)
  .patch(adminController.updateAdmin)
  .delete(adminController.deleteAdmin);

module.exports = router;
