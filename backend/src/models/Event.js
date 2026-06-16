const db = require('../config/database');

class Event {
  static async create(title, description, eventDate, location, capacity, registrationDeadline = null, category = 'Conference') {
    const result = await db.query(
      `INSERT INTO events (
        title,
        description,
        event_date,
        location,
        capacity,
        registration_deadline,
        category
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, event_date, location, capacity, registration_deadline, category`,
      [title, description, eventDate, location, capacity, registrationDeadline, category]
    );

    const event = result.rows[0];
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      eventDate: event.event_date,
      location: event.location,
      capacity: event.capacity,
      registrationDeadline: event.registration_deadline,
      category: event.category,
    };
  }

  static async findAll(page = 1, limit = 10, search = null, startDate = null, endDate = null, category = null) {
    const offset = (page - 1) * limit;
    let baseQuery = `
      SELECT e.*, COUNT(r.id)::int as registered_count
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE 1=1
    `;
    const params = [];

    if (search && search.trim() !== '') {
      params.push(`%${search}%`, `%${search}%`);
      baseQuery += ` AND (e.title ILIKE $${params.length - 1} OR e.description ILIKE $${params.length})`;
    }

    if (category && category.trim() !== '') {
      params.push(category.trim());
      baseQuery += ` AND LOWER(e.category) = LOWER($${params.length})`;
    }

    if (startDate) {
      params.push(startDate);
      baseQuery += ` AND e.event_date >= $${params.length}`;
    }

    if (endDate) {
      params.push(endDate);
      baseQuery += ` AND e.event_date <= $${params.length}`;
    }

    params.push(Number.parseInt(limit, 10), Number.parseInt(offset, 10));
    const finalQuery = `${baseQuery}
      GROUP BY e.id
      ORDER BY e.event_date ASC
      LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await db.query(finalQuery, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT e.*, COUNT(r.id)::int as registered_count
       FROM events e
       LEFT JOIN registrations r ON e.id = r.event_id
       WHERE e.id = $1
       GROUP BY e.id`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async update(id, updates) {
    const columnMap = {
      title: 'title',
      description: 'description',
      eventDate: 'event_date',
      event_date: 'event_date',
      location: 'location',
      capacity: 'capacity',
      registrationDeadline: 'registration_deadline',
      registration_deadline: 'registration_deadline',
      category: 'category',
    };
    const entries = Object.entries(updates)
      .filter(([field]) => columnMap[field])
      .map(([field, value]) => [columnMap[field], value === '' ? null : value]);
    const fields = entries.map(([field]) => field);
    const values = entries.map(([, value]) => value);

    if (fields.length === 0) {
      return this.findById(id);
    }

    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(id);

    await db.query(
      `UPDATE events SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length}`,
      values
    );

    return this.findById(id);
  }

  static async delete(id) {
    await db.withTransaction(async (client) => {
      await client.query('DELETE FROM registrations WHERE event_id = $1', [id]);
      await client.query('DELETE FROM events WHERE id = $1', [id]);
    });

    return true;
  }
}

module.exports = Event;
