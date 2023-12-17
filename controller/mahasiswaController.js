const connection = require("../config/config.js");

const createmahasiswa = (req, res) => {
  const {nrp, nama_mhs, email_mhs, prodi} = req.body;
  const insertmhsquery =
    "INSERT INTO `mahasiswa`(`nrp`, `nama_mhs`, `email_mhs`, `prodi`) VALUES (?, ?, ?, ?)";
  const values = [nrp, nama_mhs, email_mhs, prodi];

  connection.query(insertmhsquery, values, (err, results) => {
    if (err) {
      console.error("Error:", err);
      res.status(400).json({ message: "Gagal menambahkan data Mahasiswa" });
    } else {
      res.status(201).json({ message: "Berhasil menambahkan data Mahasiswa" });
    }
  });
};

const getAllmahasiswa = (req, res) => {
  const getmhsquery = "SELECT * FROM mahasiswa";

  connection.query(getmhsquery, (err, results) => {
    if (err) {
      res.status(500).json({ message: "Gagal memuat data Mahasiswa" });
    } else {
      res.json(results);
    }
  });
};

const getmhsId = (req, res) => {
  const mhsId = req.params.nrp;
  const getmhsIdquery = "SELECT * FROM mahasiswa WHERE nrp = ?";

  connection.query(getmhsIdquery, [mhsId], (err, results) => {
    if (err) {
      res.status(500).json({ message: "Gagal memuat data mahasiswa" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Data mahasiswa tidak ditemukan" });
    } else {
      res.json(results[0]);
    }
  });
};

const deletemhsId = (req, res) => {
  const mhsId = req.params.nrp;
  const deletmhsquery = "DELETE FROM mahasiswa WHERE nrp = ?";

  connection.query(deletmhsquery, [mhsId], (err, results) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: "Data mahasiswa tidak ditemukan" });
    } else {
      res.json({ message: "Data mahasiswa berhasil dihapus" });
    }
  });
};

const updatemhsId = (req, res) => {
  const mhsId = req.params.nrp;
  const { nrp, nama_mhs, email_mhs, prodi } = req.body;
  const updatemhsquery =
    "UPDATE mahasiswa SET nrp = ?, nama_mhs = ?, email_mhs = ? WHERE nrp = ?";

  connection.query(
    updatemhsquery,
    [nrp, nama_mhs, email_mhs, prodi, mhsId],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ message: "Data mahasiswa tidak ditemukan" });
        } else {
          res.json({ message: "Data mahasiswa berhasil diperbarui" });
        }
      }
    }
  );
};

const patchmhsId = (req, res) => {
  const mhsId = req.params.nrp;
  const { nrp, nama_mhs, email_mhs, prodi } = req.body;
  const patchdosequery = "UPDATE mahasiswa SET ? WHERE nrp = ?";

  // Build an object with non-null fields from the request body
  const updatemahasiswaFields = {};
  if (nrp) updatemahasiswaFields.nrp = nrp;
  if (nama_mhs) updatemahasiswaFields.nama_mhs = nama_mhs;
  if (email_mhs) updatemahasiswaFields.email_mhs = email_mhs;
  if (prodi) updatemahasiswaFields.prodi = prodi;

  connection.query(
    patchdosequery, [updatemahasiswaFields, mhsId], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ message: "Data mahasiswa tidak ditemukan" });
        } else {
          res.json({ message: "Data mahasiswa berhasil diperbarui" });
        }
      }
    }
  );
};

module.exports = {
  createmahasiswa,
  getAllmahasiswa,
  getmhsId,
  updatemhsId,
  patchmhsId,
  deletemhsId,
};
