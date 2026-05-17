const pool = require('../config/db');

// @desc    Get all tourist places
// @route   GET /api/places
// @access  Public
const getPlaces = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM places ORDER BY id ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getPlaces,
};
