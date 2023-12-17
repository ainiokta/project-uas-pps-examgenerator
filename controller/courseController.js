const connection = require("../config/config.js");

const createCourse = (req, res) => {
  const { id, nama_crs, kelas, dosen, jmlh_mhs, deskripsi } = req.body;
  const insertcoursequery =
    "INSERT INTO `course`(`id`, `nama_crs`, `kelas`, `dosen`, `jmlh_mhs`, `deskripsi`) VALUES (?, ?, ?, ?, ?, ?)";

  const values = [id, nama_crs, kelas, dosen, jmlh_mhs, deskripsi];

  connection.query(insertcoursequery, values, (err, results) => {
    if (err) {
      console.error("Error:", err);
      res
        .status(400)
        .json({ message: "Gagal menambahkan data mata kuliah baru" });
    } else {
      res
        .status(201)
        .json({ message: "Berhasil menambahkan data mata kuliah baru" });
    }
  });
};

const getcourse = (req, res) => {
  const getcrsquery = "SELECT * FROM course";

  connection.query(getcrsquery, (err, results) => {
    if (err) {
      res.status(500).json({ message: "Gagal memuat mata kuliah" });
    } else {
      res.json(results);
    }
  });
};

const getcourseId = (req, res) => {
  const getcrsIdquery = "SELECT * FROM course WHERE id = ?";
  const courseId = req.params.id;

  connection.query(getcrsIdquery, [courseId], (err, results) => {
    if (err) {
      res.status(500).json({ message: "Gagal memuat data course" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Data mata kuliah tidak ditemukan" });
    } else {
      res.json(results[0]);
    }
  });
};

const deletecrsId = (req, res) => {
  const crsId = req.params.id;
  const deletcrsquery = "DELETE FROM course WHERE id = ?";

  connection.query(deletcrsquery, [crsId], (err, results) => {
    if (err) {
      res.status(500).json({ message: "Gagal menghapus mata kuliah" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: "Tidak ada data yang terhapus" });
    } else {
      res.json({ message: "Data mata kuliah berhasil dihapus" });
    }
  });
};

const updatecrsId = (req, res) => {
  const crsId = req.params.nrp;
  const { id, nama_crs, kelas, dosen, jmlh_mhs, deskripsi } = req.body;
  const updatemhsquery =
    "UPDATE course SET id = ?, nama_crs = ?, kelas = ?, dosen = ?, jmlh_mhs = ?, deskripsi = ? WHERE id = ?";

  connection.query(updatemhsquery,[id, nama_crs, kelas, dosen, jmlh_mhs, deskripsi, crsId], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ message: "Tidak ada data yang diperbarui" });
        } else {
          res.json({ message: "Data course berhasil diperbarui" });
        }
      }
    });
};

const patchcrsId = (req, res) => {
  const crsId = req.params.id;
  const { id, nama_crs, kelas, dosen, jmlh_mhs, deskripsi } = req.body;
  const patchcrsquery = "UPDATE course SET ? WHERE id = ?";

  // Build an object with non-null fields from the request body
  const updatecourseFields = {};
  if (id) updatecourseFields.id = id;
  if (nama_crs) updatecourseFields.nama_crs = nama_crs;
  if (kelas) updatecourseFields.kelas = kelas;
  if (dosen) updatecourseFields.dosen = dosen;
  if (jmlh_mhs) updatecourseFields.jmlh_mhs = jmlh_mhs;
  if (deskripsi) updatecourseFields.deskripsi = deskripsi;
  
  connection.query(patchcrsquery, [updatecourseFields, crsId], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ message: "Tidak ada data yang diperbarui" });
        } else {
          res.json({ message: "Data course berhasil diperbarui" });
        }
      }
    }
  );
};

module.exports = {
  createCourse,
  getcourse,
  getcourseId,
  deletecrsId,
  patchcrsId,
  updatecrsId
};
