const db = require('../config/database');

class User {
  static async create(email, fullName, passwordHash) {
    const result = await db.query(
      `INSERT INTO users (email, full_name, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role`,
      [email, fullName, passwordHash, 'attendee']
    );

    const user = result.rows[0];
    return { id: user.id, email: user.email, fullName: user.full_name, role: user.role };
  }

  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT id, email, full_name, role FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findAllWithStats() {
    const result = await db.query(
      `SELECT
        u.id,
        u.email,
        u.full_name,
        u.role,
        u.created_at,
        COUNT(r.id)::int AS registrations_count
       FROM users u
       LEFT JOIN registrations r ON u.id = r.user_id
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    return result.rows;
  }
}

module.exports = User;
