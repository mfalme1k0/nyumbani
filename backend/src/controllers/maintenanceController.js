import { query } from '../db.js';

export const reportIssue = async (req, res) => {
  const { propertyId, title, description, category, priority } = req.body;
  try {
    const result = await query(
      `INSERT INTO maintenance_requests (property_id, tenant_id, agent_id, title, description, category, status, priority)
       VALUES ($1, $2, NULL, $3, $4, $5, 'open', $6) RETURNING *`,
      [propertyId, req.user.id, title, description, category, priority]
    );
    res.status(201).json({ request: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not submit maintenance request' });
  }
};

export const listMaintenanceRequests = async (req, res) => {
  try {
    const result = await query('SELECT * FROM maintenance_requests ORDER BY created_at DESC LIMIT 200');
    res.json({ maintenance: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to list maintenance requests' });
  }
};

export const updateMaintenanceStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status, agentId } = req.body;
  try {
    const result = await query(
      'UPDATE maintenance_requests SET status = $1, agent_id = COALESCE($2, agent_id), updated_at = NOW() WHERE id = $3 RETURNING *',
      [status, agentId, requestId]
    );
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }
    res.json({ request: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update maintenance request' });
  }
};
