const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware.js");
const roleMiddleware = require("../middleware/role.middleware.js");

const VehicleController = require("../controllers/vehicle.controller.js");
const validate = require("../utils/validations/validation.js");
const { vehiclesSchema } = require("../middleware/validations/vehicles.validation.js");

// Create vehicle
router.post("/", validate(vehiclesSchema), authMiddleware.verifyToken, roleMiddleware.authorize("admin"), VehicleController.create);

// Find vehicle by plate number
router.get("/:plate_number", authMiddleware.verifyToken, roleMiddleware.authorize("admin"), VehicleController.findByPlateNumber);

// Find all vehicles
router.get("/", authMiddleware.verifyToken, roleMiddleware.authorize("admin"), VehicleController.findAll);

// Update vehicle
router.put("/:id", validate(vehiclesSchema), authMiddleware.verifyToken, roleMiddleware.authorize("admin"), VehicleController.update);

// Delete vehicle
router.delete("/:id", authMiddleware.verifyToken, roleMiddleware.authorize("admin"), VehicleController.delete);

module.exports = router;