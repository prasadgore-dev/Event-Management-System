const pool = require('../config/database');

class User {
  static async create(email, fullName, passwordHash) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO users (email, full_name, password_hash, role) VALUES (?, ?, ?, ?)',
        [email, fullName, passwordHash, 'attendee']
      );
      connection.release();
      return { id: result.insertId, email, fullName, role: 'attendee' };
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
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
        'SELECT id, email, full_name, role FROM users WHERE id = ?',
        [id]
      );
      connection.release();
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async findAllWithStats() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT
          u.id,
          u.email,
          u.full_name,
          u.role,
          u.created_at,
          COUNT(r.id) AS registrations_count
         FROM users u
         LEFT JOIN registrations r ON u.id = r.user_id
         GROUP BY u.id
         ORDER BY u.created_at DESC`
      );
      connection.release();
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
