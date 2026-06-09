const pool = require('../config/database');

class Registration {
  static async create(userId, eventId) {
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      // Check event exists and get capacity info
      const [events] = await connection.execute(
        `SELECT e.capacity, COUNT(r.id) as registered_count
         FROM events e
         LEFT JOIN registrations r ON e.id = r.event_id
         WHERE e.id = ?
         GROUP BY e.id`,
        [eventId]
      );

      if (events.length === 0) {
        await connection.rollback();
        connection.release();
        return { error: 'Event not found', code: 404 };
      }

      const event = events[0];
      const remainingCapacity = event.capacity - event.registered_count;

      if (remainingCapacity <= 0) {
        await connection.rollback();
        connection.release();
        return { error: 'Event is full', code: 409 };
      }

      // Insert registration
      const [result] = await connection.execute(
        'INSERT INTO registrations (user_id, event_id, registration_date) VALUES (?, ?, NOW())',
        [userId, eventId]
      );

      await connection.commit();
      connection.release();
      return { id: result.insertId, userId, eventId };
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
        } catch (e) {}
        connection.release();
      }
      throw error;
    }
  }

  static async findByUserAndEvent(userId, eventId) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM registrations WHERE user_id = ? AND event_id = ?',
        [userId, eventId]
      );
      connection.release();
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM registrations WHERE id = ?',
        [id]
      );
      connection.release();
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM registrations WHERE id = ?', [id]);
      connection.release();
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async getEventRegistrations(eventId) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT r.id, u.id as user_id, u.email, u.full_name
         FROM registrations r
         JOIN users u ON r.user_id = u.id
         WHERE r.event_id = ?
         ORDER BY r.registration_date DESC`,
        [eventId]
      );
      connection.release();
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getUserRegistrations(userId) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT r.id, e.id as event_id, e.title, e.event_date, e.location
         FROM registrations r
         JOIN events e ON r.event_id = e.id
         WHERE r.user_id = ?
         ORDER BY e.event_date ASC`,
        [userId]
      );
      connection.release();
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Registration;
