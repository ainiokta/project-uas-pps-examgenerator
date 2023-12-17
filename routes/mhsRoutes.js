const express = require("express");
const mahasiswaController = require("../controller/mahasiswaController.js");
const router = express.Router();

router.post('/mahasiswa', mahasiswaController.createmahasiswa);
router.get('/mahasiswa', mahasiswaController.getAllmahasiswa);
router.get('/mahasiswa/:nrp', mahasiswaController.getmhsId);
router.put('/mahasiswa/:nrp', mahasiswaController.updatemhsId);
router.patch('/mahasiswa/:nrp', mahasiswaController.patchmhsId);
router.delete('/mahasiswa/:nrp', mahasiswaController.deletemhsId);

module.exports = router;