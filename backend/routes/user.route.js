const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/auth.middleware").verifyToken;
const verifyRoles = require("../middlewares/auth.middleware").verifyRoles;
const verifyMe = require("../middlewares/auth.middleware").verifyMe;

router.get("/me", verifyToken, verifyMe, userController.findMe);
router.put("/me", verifyToken, verifyMe, userController.updateMe);
router.delete("/me", verifyToken, verifyMe, userController.deleteMe);

router.get("/", verifyToken, verifyRoles("ADMIN"), userController.findAll);
router.get(
  "/:username",
  verifyToken,
  verifyRoles("ADMIN"),
  userController.findOne
);
router.post("/", verifyToken, verifyRoles("ADMIN"), userController.create);
router.put(
  "/:username",
  verifyToken,
  verifyRoles("ADMIN"),
  userController.update
);
router.delete(
  "/:username",
  verifyToken,
  verifyRoles("ADMIN"),
  userController.delete
);

module.exports = router;
