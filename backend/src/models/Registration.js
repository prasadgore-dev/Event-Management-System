const db = require('../config/database');

class Registration {
  static async create(userId, eventId) {
    return db.withTransaction(async (client) => {
      const events = await client.query(
        `SELECT e.capacity, COUNT(r.id)::int as registered_count
         FROM events e
         LEFT JOIN registrations r ON e.id = r.event_id
         WHERE e.id = $1
         GROUP BY e.id`,
        [eventId]
      );

      if (events.rows.length === 0) {
        return { error: 'Event not found', code: 404 };
      }

      const event = events.rows[0];
      const remainingCapacity = event.capacity - event.registered_count;

      if (remainingCapacity <= 0) {
        return { error: 'Event is full', code: 409 };
      }

      const result = await client.query(
        `INSERT INTO registrations (user_id, event_id, registration_date)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         RETURNING id`,
        [userId, eventId]
      );

      return { id: result.rows[0].id, userId, eventId };
    });
  }

  static async findByUserAndEvent(userId, eventId) {
    const result = await db.query(
      'SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );
    return result.rows[0] || null;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM registrations WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async delete(id) {
    await db.query('DELETE FROM registrations WHERE id = $1', [id]);
    return true;
  }

  static async getEventRegistrations(eventId) {
    const result = await db.query(
      `SELECT r.id, u.id as user_id, u.email, u.full_name
       FROM registrations r
       JOIN users u ON r.user_id = u.id
       WHERE r.event_id = $1
       ORDER BY r.registration_date DESC`,
      [eventId]
    );
    return result.rows;
  }

  static async getUserRegistrations(userId) {
    const result = await db.query(
      `SELECT r.id, e.id as event_id, e.title, e.event_date, e.location
       FROM registrations r
       JOIN events e ON r.event_id = e.id
       WHERE r.user_id = $1
       ORDER BY e.event_date ASC`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = Registration;
