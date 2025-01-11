const { Router } = require('express');
const router = Router();

const roleController = require('./roles.controller');

const { getRoleByIdValidators, createRoleValidators, upateRoleValidators, deleteRoleValidators, updateRoleValidators } = require("./roles.validators");
const handleValidations = require("../middlewares/handle.validations");

router.get("/", roleController.getRoles);

router.get("/:id",getRoleByIdValidators, handleValidations, roleController.getRoleById);

router.post("/",createRoleValidators, handleValidations, roleController.createRole);

router.put("/:id",updateRoleValidators, handleValidations, roleController.updateRole);

router.delete("/:id",deleteRoleValidators, handleValidations, roleController.deleteRole);

module.exports = router;
