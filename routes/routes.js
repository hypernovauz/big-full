const express = require("express");
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes (requires authentication)
// router.use(authMiddleware.authenticateToken);
router.get("/", adminController.getAllAdmins);
router.get("/:id", adminController.getAdminById);
router.post("/", adminController.createAdmin);
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

module.exports = router;
