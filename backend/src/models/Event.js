const pool = require('../config/database');

class Event {
  static async create(title, description, eventDate, location, capacity, registrationDeadline = null) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO events (title, description, event_date, location, capacity, registration_deadline) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, eventDate, location, capacity, registrationDeadline]
      );
      connection.release();
      return { id: result.insertId, title, description, eventDate, location, capacity, registrationDeadline };
    } catch (error) {
      throw error;
    }
  }

  static async findAll(page = 1, limit = 10, search = null, startDate = null, endDate = null, category = null) {
    try {
      const offset = (page - 1) * limit;
      const connection = await pool.getConnection();
      
      // Build query with proper parameter handling
      let baseQuery = `
        SELECT e.*, COUNT(r.id) as registered_count
        FROM events e
        LEFT JOIN registrations r ON e.id = r.event_id
        WHERE 1=1
      `;
      const params = [];

      // Add search filter
      if (search && search.trim() !== '') {
        baseQuery += ` AND (e.title LIKE ? OR e.description LIKE ?)`;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
      }

      // Add category filter
      if (category && category.trim() !== '') {
        baseQuery += ` AND LOWER(e.category) = LOWER(?)`;
        params.push(category.trim());
      }

      // Add date filters
      if (startDate) {
        baseQuery += ` AND e.event_date >= ?`;
        params.push(startDate);
      }

      if (endDate) {
        baseQuery += ` AND e.event_date <= ?`;
        params.push(endDate);
      }

      // Add GROUP BY and ORDER BY
      baseQuery += ` GROUP BY e.id ORDER BY e.event_date ASC`;

      // Build final query with LIMIT and OFFSET
      const finalQuery = baseQuery + ` LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

      const [rows] = await connection.execute(finalQuery, params);
      connection.release();
      return rows;
    } catch (error) {
      console.error('findAll query error:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT e.*, COUNT(r.id) as registered_count
         FROM events e
         LEFT JOIN registrations r ON e.id = r.event_id
         WHERE e.id = ?
         GROUP BY e.id`,
        [id]
      );
      connection.release();
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updates) {
    try {
      const connection = await pool.getConnection();
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      values.push(id);

      const query = `UPDATE events SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE id = ?`;
      await connection.execute(query, values);
      connection.release();
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();
      
      // Delete registrations first
      await connection.execute('DELETE FROM registrations WHERE event_id = ?', [id]);
      // Delete event
      await connection.execute('DELETE FROM events WHERE id = ?', [id]);
      
      await connection.commit();
      connection.release();
      return true;
    } catch (error) {
      if (connection) {
        await connection.rollback();
        connection.release();
      }
      throw error;
    }
  }
}

module.exports = Event;
