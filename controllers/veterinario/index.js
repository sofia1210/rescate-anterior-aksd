const { v4: uuidv4 } = require('uuid');
const pg = require('./pgVeterinarioController');
const mongo = require('./mongoVeterinarioController');

exports.create = async (req, res) => {
    try {
      console.log('[Veterinarios][create] body:', req.body, 'file:', !!req.file);
      const id = uuidv4();
      const imagen = req.file ? req.file.filename : null;
      const data = { ...req.body, imagen };
  
      const pgResult = await pg.createDirect(data, id);
      const mongoResult = await mongo.createDirect(data, id);
      
      res.status(201).json({ postgres: pgResult, mongo: mongoResult });
    } catch (err) {
      console.error('[Veterinarios][create][error]:', err.message, err.stack);
      res.status(500).json({ error: err.message });
    }
  };

exports.getAll = async (req, res) => {
  try {
    console.log('[Veterinarios][getAll]');
    const pgResult = await pg.getAllDirect();
    const mongoResult = await mongo.getAllDirect();
    res.json({ postgres: pgResult, mongo: mongoResult });
  } catch (err) {
    console.error('[Veterinarios][getAll][error]:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    console.log('[Veterinarios][getById] params:', req.params);
    const pgResult = await pg.getByIdDirect(req.params.id);
    const mongoResult = await mongo.getByIdDirect(req.params.id);
    res.json({ postgres: pgResult, mongo: mongoResult });
  } catch (err) {
    console.error('[Veterinarios][getById][error]:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
    try {
      console.log('[Veterinarios][update] params:', req.params, 'body:', req.body, 'file:', !!req.file);
      const imagen = req.file ? req.file.filename : null;
      const data = imagen ? { ...req.body, imagen } : req.body;
  
      const pgResult = await pg.updateDirect(req.params.id, data);
      const mongoResult = await mongo.updateDirect(req.params.id, data);
  
      res.json({ postgres: pgResult, mongo: mongoResult });
    } catch (err) {
      console.error('[Veterinarios][update][error]:', err.message, err.stack);
      res.status(500).json({ error: err.message });
    }
  };

exports.delete = async (req, res) => {
  try {
    console.log('[Veterinarios][delete] params:', req.params);
    const pgResult = await pg.deleteDirect(req.params.id);
    const mongoResult = await mongo.deleteDirect(req.params.id);
    res.json({ postgres: pgResult, mongo: mongoResult });
  } catch (err) {
    console.error('[Veterinarios][delete][error]:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};
