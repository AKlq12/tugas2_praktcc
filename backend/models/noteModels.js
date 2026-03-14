const Note = require("../schema/Note");

const findAll = async () => {
  return await Note.findAll({
    order: [["tanggal_dibuat", "DESC"]],
  });
};

const create = async (noteData) => {
  return await Note.create(noteData);
};

const findById = async (id) => {
  return await Note.findByPk(id);
};

const updateById = async (id, noteData) => {
  return await Note.update(noteData, {
    where: { id: id },
  });
};

const deleteById = async (id) => {
  return await Note.destroy({
    where: { id: id },
  });
};

module.exports = {
  findAll,
  create,
  findById,
  updateById,
  deleteById,
};
