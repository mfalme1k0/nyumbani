import { query } from '../db.js';

export const listPayments = async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, l.tenant_id, l.property_id, u.email AS tenant_email
       FROM payments p
       JOIN leases l ON l.id = p.lease_id
       JOIN users u ON u.id = l.tenant_id
       ORDER BY p.due_date DESC LIMIT 200`
    );
    res.json({ payments: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to list payments' });
  }
};

export const getPaymentById = async (req, res) => {
  const { paymentId } = req.params;
  try {
    const result = await query('SELECT * FROM payments WHERE id = $1', [paymentId]);
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ payment: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch payment' });
  }
};
