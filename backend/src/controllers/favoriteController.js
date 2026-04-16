import { query } from '../db.js';

export const listFavorites = async (req, res) => {
  try {
    const result = await query(
      `SELECT f.id AS favorite_id, p.*
       FROM favorites f
       JOIN properties p ON p.id = f.property_id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    res.json({ favorites: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load favorites' });
  }
};

export const addFavorite = async (req, res) => {
  const { propertyId } = req.body;
  try {
    const result = await query(
      `INSERT INTO favorites (user_id, property_id) VALUES ($1, $2) RETURNING *`,
      [req.user.id, propertyId]
    );
    res.status(201).json({ favorite: result.rows[0] });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Property already favorited' });
    }
    res.status(500).json({ error: 'Unable to add favorite' });
  }
};

export const removeFavorite = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const result = await query(
      'DELETE FROM favorites WHERE user_id = $1 AND property_id = $2 RETURNING *',
      [req.user.id, propertyId]
    );
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to remove favorite' });
  }
};
