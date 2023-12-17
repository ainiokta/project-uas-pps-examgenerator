const connection = require("../config/config.js");

const createDosen = (req, res) => {
  const { id_Dosen, nama_dosen, email_dosen, prodi } = req.body;
  const insertdosenquery =
    "INSERT INTO `dosen`(`id_Dosen`, `nama_dosen`, `email_dosen`, `prodi`) VALUES (?, ?, ?, ?)";
  const values = [id_Dosen, nama_dosen, email_dosen, prodi];

  connection.query(insertdosenquery, values, (err, results) => {
    if (err) {
      console.error("Error:", err);
      res.status(400).json({ message: "Gagal memasukkan data Dosen" });
    } else {
      res.status(201).json({ message: "Berhasil memasukkan data Dosen" });
    }
  });
};

const getAllDosen = (req, res) => {
  const getdosenquery = "SELECT * FROM dosen";

  connection.query(getdosenquery, (err, results) => {
    if (err) {
      res.status(500).json({ message: "Gagal memuat data Dosen" });
    } else {
      res.json(results);
    }
  });
};

const getDosenId = (req, res) => {
  const dosenId = req.params.id_Dosen;
  const getdosenIdquery = "SELECT * FROM dosen WHERE id_Dosen = ?";

  connection.query(getdosenIdquery, [dosenId], (err, results) => {
    if (err) {
      res.status(500).json({ message: "Gagal memuat data Dosen" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Data Dosen tidak ditemukan" });
    } else {
      res.json(results[0]);
    }
  });
};

const deleteDosenId = (req, res) => {
  const dosenId = req.params.id_Dosen;
  const deletdosenquery = "DELETE FROM dosen WHERE id_Dosen = ?";

  connection.query(deletdosenquery, [dosenId], (err, results) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: "Data Dosen tidak ditemukan" });
    } else {
      res.json({ message: "Data Dosen berhasil dihapus" });
    }
  });
};

const updateDosenId = (req, res) => {
  const dosenId = req.params.id_Dosen;
  const { id_Dosen, nama_dosen, email_dosen, prodi } = req.body;
  const updatedosenquery =
    "UPDATE dosen SET id_Dosen = ?, nama_dosen = ?, email_dosen = ? WHERE id_Dosen = ?";

  connection.query(
    updatedosenquery,
    [id_Dosen, nama_dosen, email_dosen, prodi, dosenId],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ message: "Data Dosen tidak ditemukan" });
        } else {
          res.json({ message: "Data Dosen berhasil diperbarui" });
        }
      }
    }
  );
};

const patchDosenId = (req, res) => {
  const dosenId = req.params.id_Dosen;
  const { id_Dosen, nama_dosen, email_dosen, prodi } = req.body;
  const patchdosequery = "UPDATE dosen SET ? WHERE id_Dosen = ?";

  // Build an object with non-null fields from the request body
  const updateDosenFields = {};
  if (id_Dosen) updateDosenFields.id_Dosen = id_Dosen;
  if (nama_dosen) updateDosenFields.nama_dosen = nama_dosen;
  if (email_dosen) updateDosenFields.email_dosen = email_dosen;
  if (prodi) updateDosenFields.prodi = prodi;

  connection.query(
    patchdosequery,
    [updateDosenFields, dosenId],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ message: "Data Dosen tidak ditemukan" });
        } else {
          res.json({ message: "Data Dosen berhasil diperbarui" });
        }
      }
    }
  );
};

module.exports = {
  createDosen,
  getAllDosen,
  getDosenId,
  updateDosenId,
  patchDosenId,
  deleteDosenId,
};
