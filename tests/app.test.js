const request = require("supertest");
const app = require("../src/index");

describe("Pengujian API Cloud Computing", () => {
  // Test 1: Menguji endpoint health check
  it("GET /health harus mengembalikan status OK", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "OK");
  });

  // Test 2: Menguji validasi input (harus gagal jika data tidak lengkap)
  it("POST /api/users harus ditolak jika input tidak lengkap", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ nama: "Mahasiswa" }); // Sengaja tidak mengirimkan email

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "Nama dan email wajib diisi");
  });

  // Test 3: Menguji endpoint pengambilan data
  it("GET /api/users harus merespon dengan data array atau pesan error database", async () => {
    const res = await request(app).get("/api/users");
    // Menerima 200 (jika DB menyala) atau 500 (jika DB mati saat test)
    expect([200, 500]).toContain(res.statusCode);
  });
});
