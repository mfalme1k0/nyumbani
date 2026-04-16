import { query } from '../db.js';

export const getTenantProfile = async (req, res) => {
  try {
    const result = await query('SELECT id, email, first_name, last_name, role, phone, created_at FROM users WHERE id = $1', [req.user.id]);
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load tenant profile' });
  }
};

export const updateTenantProfile = async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  try {
    const result = await query(
      'UPDATE users SET first_name = $1, last_name = $2, phone = $3, updated_at = NOW() WHERE id = $4 RETURNING id, email, first_name, last_name, role, phone, created_at',
      [firstName, lastName, phone, req.user.id]
    );
    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update profile' });
  }
};

export const getTenantLeases = async (req, res) => {
  const { tenantId } = req.params;
  try {
    const result = await query(
      `SELECT l.*, p.title AS property_title, p.address AS property_address
       FROM leases l
       JOIN properties p ON p.id = l.property_id
       WHERE l.tenant_id = $1`,
      [tenantId]
    );
    res.json({ leases: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load tenant leases' });
  }
};
