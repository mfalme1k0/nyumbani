import { query } from '../db.js';

export const createProperty = async (req, res) => {
  const {
    title,
    description,
    address,
    location,
    rentAmount,
    beds,
    baths,
    areaSqft,
    securityRating,
    status,
    available
  } = req.body;

  try {
    const result = await query(
      `INSERT INTO properties (owner_id, title, description, address, location, rent_amount, beds, baths, area_sqft, security_rating, status, available)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [
        req.user.id,
        title,
        description,
        address,
        location,
        rentAmount,
        beds,
        baths,
        areaSqft,
        securityRating,
        status,
        available
      ]
    );
    res.status(201).json({ property: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create property' });
  }
};

export const updateProperty = async (req, res) => {
  const { propertyId } = req.params;
  const fields = req.body;
  const sets = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(fields)) {
    sets.push(`${key} = $${idx}`);
    values.push(value);
    idx += 1;
  }
  values.push(propertyId);

  try {
    const result = await query(
      `UPDATE properties SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`,
      values
    );
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ property: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update property' });
  }
};

export const listProperties = async (req, res) => {
  const { location, minRent, maxRent, beds, baths, securityRating, status, available, search } = req.query;
  const clauses = [];
  const values = [];
  let idx = 1;

  if (location) {
    clauses.push(`location ILIKE $${idx++}`);
    values.push(`%${location}%`);
  }
  if (minRent) {
    clauses.push(`rent_amount >= $${idx++}`);
    values.push(minRent);
  }
  if (maxRent) {
    clauses.push(`rent_amount <= $${idx++}`);
    values.push(maxRent);
  }
  if (beds) {
    clauses.push(`beds = $${idx++}`);
    values.push(beds);
  }
  if (baths) {
    clauses.push(`baths = $${idx++}`);
    values.push(baths);
  }
  if (securityRating) {
    clauses.push(`security_rating >= $${idx++}`);
    values.push(securityRating);
  }
  if (status) {
    clauses.push(`status = $${idx++}`);
    values.push(status);
  }
  if (available) {
    clauses.push(`available = $${idx++}`);
    values.push(available === 'true');
  }
  if (search) {
    clauses.push(`(title ILIKE $${idx} OR description ILIKE $${idx})`);
    values.push(`%${search}%`);
    idx += 1;
  }

  const whereClause = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  try {
    const result = await query(`SELECT * FROM properties ${whereClause} ORDER BY created_at DESC LIMIT 100`, values);
    res.json({ properties: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not list properties' });
  }
};

export const getPropertyDetails = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const result = await query('SELECT * FROM properties WHERE id = $1', [propertyId]);
    if (!result.rowCount) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ property: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch property details' });
  }
};
