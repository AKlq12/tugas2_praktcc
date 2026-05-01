# Dokumentasi
File ini dibuat untuk membantu memahami konsep database dan ORM di Node.js menggunakan Sequelize.

## Prerequisite
1. Nodejs
2. MySQL pake XAMPP

## Instalasi
1. Setup projek node.js `npm init -y`
2. install packagenya `npm install express mysql2 dotenv sequelize cors`
3. install nodemon `npm i --save-dev nodemon`

## Langkah Yang dilakukan
1. Buat struktur foldernya dulu
```
config/ --> untuk  naruh config
controllers/ --> untuk logika API nya
models/ --> untuk query nya
routes/ --> untuk route atau endopintnya
schema/ --> untuk buat tabel database
index.js --> untuk menjalankan server bisa juga server.js
```
1. Ubah `.env.example` menjadi `.env` dan ubah sesuai database kalian
2. Buat file config/database.js untuk konekin sequalizenya
3. Buat file schema/Note.js untuk membuat tabel nya
4. Buat file models/noteModels.js untuk querynya
5. Buat file controllers/noteController.js untuk logika API nya
6. Buat file routes/notes.js untuk route API nya
7. Buat file index.js untuk menjalankan server
8. Sebelum menjalankan, buat dulu databasenya kalo eror
9. Test API pake api.rest pake extenstion REST.API

## API Endpoints
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /api/notes | Lihat semua catatan |
| GET | /api/notes/:id | Lihat detail catatan |
| POST | /api/notes | Tambah catatan baru |
| PUT | /api/notes/:id | Edit catatan |
| DELETE | /api/notes/:id | Hapus catatan |

### Tambahan Diluar
Bisa juga gak pake nodemon, tapi pake `node --watch . index.js` , nanti kalo bisa restart kalo ada perubahan ketika di save
