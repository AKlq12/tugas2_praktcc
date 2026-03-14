const noteModel = require("../models/noteModels");

const getAllNotes = async (req, res) => {
  try {
    const allNotes = await noteModel.findAll();
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil semua catatan",
      data: allNotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil catatan",
      error: error.message,
    });
  }
};

const createNote = async (req, res) => {
  const { judul, isi } = req.body;

  if (!judul || !isi) {
    return res.status(400).json({
      success: false,
      message: "Judul dan isi catatan wajib diisi",
    });
  }

  try {
    const newNote = await noteModel.create({ judul, isi });
    res.status(201).json({
      success: true,
      message: "Catatan berhasil ditambahkan",
      data: newNote,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Gagal menambah catatan",
      error: error.message,
    });
  }
};

const getNoteById = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await noteModel.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Catatan tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil detail catatan",
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail catatan",
      error: error.message,
    });
  }
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const { judul, isi } = req.body;

  if (!judul || !isi) {
    return res.status(400).json({
      success: false,
      message: "Judul dan isi catatan wajib diisi",
    });
  }

  try {
    const note = await noteModel.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Catatan tidak ditemukan",
      });
    }

    await noteModel.updateById(id, { judul, isi });

    const updatedNote = await noteModel.findById(id);
    res.status(200).json({
      success: true,
      message: "Catatan berhasil diperbarui",
      data: updatedNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui catatan",
      error: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await noteModel.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Catatan tidak ditemukan",
      });
    }

    await noteModel.deleteById(id);
    res.status(200).json({
      success: true,
      message: "Catatan berhasil dihapus",
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus catatan",
      error: error.message,
    });
  }
};

module.exports = {
  getAllNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
};
