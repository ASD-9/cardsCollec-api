const { Router } = require('express');
const router = Router();

const roleController = require('./roles.controller');

const idValidator = require("../services/id.validator");
const { createRoleValidators, updateRoleValidators } = require("./roles.validators");
const handleValidations = require("../middlewares/handle.validations");

router.get("/", roleController.getRoles);

router.get("/:id",idValidator, handleValidations, roleController.getRoleById);

router.post("/",createRoleValidators, handleValidations, roleController.createRole);

router.put("/:id",updateRoleValidators, handleValidations, roleController.updateRole);

router.delete("/:id",idValidator, handleValidations, roleController.deleteRole);

module.exports = router;
