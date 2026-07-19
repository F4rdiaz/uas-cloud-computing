const express = require("express");
require("dotenv").config();
const db = require("./db");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// Fungsi untuk membuat tabel otomatis jika belum ada
const initDB = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL
      )
    `);
    console.log("Tabel users siap digunakan.");
  } catch (err) {
    console.error("Gagal inisialisasi tabel:", err.message);
  }
};
initDB();

// 1. Endpoint Health Check (Syarat Proyek)
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "Layanan berjalan dengan baik" });
});

// 2. Menampilkan Data (Read)
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Menambahkan Data & Validasi Input (Create)
app.post("/api/users", async (req, res) => {
  const { nama, email } = req.body;

  // Validasi input wajib diisi
  if (!nama || !email) {
    return res.status(400).json({ error: "Nama dan email wajib diisi" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO users (nama, email) VALUES (?, ?)",
      [nama, email],
    );
    res.status(201).json({ id: result.insertId, nama, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Menghapus Data (Delete)
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mengekspor app untuk testing, mencegah server listen port saat test berjalan
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
}

module.exports = app;
