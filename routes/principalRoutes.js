const express = require("express");
const router = express.Router();
const principalController = require("../controller/principalController");

router.route("/")
  .get(principalController.getAllPrincipals)
  .post(principalController.createPrincipal)
  .delete(principalController.deletePrincipal);

module.exports = router;