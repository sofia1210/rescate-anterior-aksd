const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pg = require("../user/pgUserController");
const MONGO_ENABLED = (process.env.MONGO_ENABLED || 'true') === 'true';
const mongo = MONGO_ENABLED ? require("../user/mongoUserController") : null;

exports.create = async (req, res) => {
  try {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const bodyWithHash = { ...req.body, password: hashedPassword };
    const pgResult = await pg.createDirect(bodyWithHash, id);
    let mongoResult = null;
    if (MONGO_ENABLED && mongo) {
      try {
        mongoResult = await mongo.createDirect(bodyWithHash, id);
      } catch (mongoErr) {
        console.warn('[Users][create] Mongo warning:', mongoErr?.message || mongoErr);
      }
    }
    res.status(201).json({ postgres: pgResult, mongo: mongoResult });
  } catch (err) {
    console.error('[Users][create] error:', err);
    // MSSQL duplicate key errors: 2627 (unique constraint), 2601 (duplicate index)
    if (err && (err.number === 2627 || err.number === 2601)) {
      return res.status(409).json({ error: 'Email o username ya están registrados' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const pgResult = await pg.getAllDirect();
    const mongoResult = await mongo.getAllDirect();
    res.json({ postgres: pgResult, mongo: mongoResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const pgResult = await pg.getByIdDirect(req.params.id);
    const mongoResult = await mongo.getByIdDirect(req.params.id);
    res.json({ postgres: pgResult, mongo: mongoResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }
    const pgResult = await pg.updateDirect(req.params.id, payload);
    const mongoResult = await mongo.updateDirect(req.params.id, payload);
    res.json({ postgres: pgResult, mongo: mongoResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y password son requeridos' });

    // Forzar solo PostgreSQL
    const user = await pg.findByEmail(email);

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '12h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const pgResult = await pg.deleteDirect(req.params.id);
    const mongoResult = await mongo.deleteDirect(req.params.id);
    res.json({ postgres: pgResult, mongo: mongoResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
