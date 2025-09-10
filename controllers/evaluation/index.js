const { v4: uuidv4 } = require('uuid');
const pg = require('../evaluation/pgEvaluationController');
const mongo = require('../evaluation/mongoEvaluationController');

exports.create = async (req, res) => {
  try {
    console.log('[Evaluations][create] body:', req.body);
    const id = uuidv4();
    const pgResult = await pg.createDirect(req.body, id);
    const mongoResult = await mongo.createDirect(req.body, id);
    res.status(201).json({ postgres: pgResult, mongo: mongoResult });
  } catch (err) {
    console.error('[Evaluations][create][error]:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    console.log('[Evaluations][getAll]');
    const pgResult = await pg.getAllDirect();
    const mongoResult = await mongo.getAllDirect();
    res.json({ postgres: pgResult, mongo: mongoResult });
  } catch (err) {
    console.error('[Evaluations][getAll][error]:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    console.log('[Evaluations][getById] params:', req.params);
    const pgResult = await pg.getByIdDirect(req.params.id);
    const mongoResult = await mongo.getByIdDirect(req.params.id);
    res.json({ postgres: pgResult, mongo: mongoResult });
  } catch (err) {
    console.error('[Evaluations][getById][error]:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    console.log('[Evaluations][update] params:', req.params, 'body:', req.body);
    const pgResult = await pg.updateDirect(req.params.id, req.body);
    const mongoResult = await mongo.updateDirect(req.params.id, req.body);
    res.json({ postgres: pgResult, mongo: mongoResult });
  } catch (err) {
    console.error('[Evaluations][update][error]:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    console.log('[Evaluations][delete] params:', req.params);
    const pgResult = await pg.deleteDirect(req.params.id);
    const mongoResult = await mongo.deleteDirect(req.params.id);
    res.json({ postgres: pgResult, mongo: mongoResult });
  } catch (err) {
    console.error('[Evaluations][delete][error]:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};
