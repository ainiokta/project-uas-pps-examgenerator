const express = require("express");
const dosenController = require("../controller/dosenController.js");
const router = express.Router();

router.post('/dosen', dosenController.createDosen);
router.get('/dosen', dosenController.getAllDosen);
router.get('/dosen/:id_Dosen', dosenController.getDosenId);
router.put('/dosen/:id_Dosen', dosenController.updateDosenId);
router.patch('/dosen/:id_Dosen', dosenController.patchDosenId);
router.delete('/dosen/:id_Dosen', dosenController.deleteDosenId);

module.exports = router;