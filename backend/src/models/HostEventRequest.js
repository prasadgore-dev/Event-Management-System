const pool = require('../config/database');

class HostEventRequest {
  static async ensureSchema() {
    const connection = await pool.getConnection();
    try {
      const [columns] = await connection.execute(
        `SELECT COLUMN_NAME
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'host_event_requests'
           AND COLUMN_NAME = 'hosted_event_id'`
      );

      if (columns.length === 0) {
        await connection.execute(
          'ALTER TABLE host_event_requests ADD COLUMN hosted_event_id INT NULL AFTER additional_message'
        );
      }
    } finally {
      connection.release();
    }
  }

  static async create(requestData) {
    const connection = await pool.getConnection();
    try {
      const {
        fullName,
        email,
        phoneNumber,
        eventTitle,
        eventCategory,
        eventDescription,
        eventDate,
        eventTime,
        eventLocation,
        expectedParticipants,
        additionalMessage,
      } = requestData;

      const [result] = await connection.execute(
        `INSERT INTO host_event_requests (
          full_name,
          email,
          phone_number,
          event_title,
          event_category,
          event_description,
          event_date,
          event_time,
          event_location,
          expected_participants,
          additional_message
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fullName,
          email,
          phoneNumber,
          eventTitle,
          eventCategory,
          eventDescription,
          eventDate,
          eventTime,
          eventLocation,
          expectedParticipants,
          additionalMessage || null,
        ]
      );

      return { id: result.insertId, ...requestData, status: 'pending' };
    } finally {
      connection.release();
    }
  }

  static async findAll() {
    await this.ensureSchema();
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT
          id,
          full_name,
          email,
          phone_number,
          event_title,
          event_category,
          event_description,
          event_date,
          event_time,
          event_location,
          expected_participants,
          additional_message,
          hosted_event_id,
          status,
          created_at,
          updated_at
        FROM host_event_requests
        ORDER BY created_at DESC`
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async findByEmail(email) {
    await this.ensureSchema();
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT
          id,
          full_name,
          email,
          phone_number,
          event_title,
          event_category,
          event_description,
          event_date,
          event_time,
          event_location,
          expected_participants,
          additional_message,
          hosted_event_id,
          status,
          created_at,
          updated_at
        FROM host_event_requests
        WHERE email = ?
        ORDER BY created_at DESC`,
        [email]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    await this.ensureSchema();
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT
          id,
          full_name,
          email,
          phone_number,
          event_title,
          event_category,
          event_description,
          event_date,
          event_time,
          event_location,
          expected_participants,
          additional_message,
          hosted_event_id,
          status,
          created_at,
          updated_at
        FROM host_event_requests
        WHERE id = ?`,
        [id]
      );
      return rows.length > 0 ? rows[0] : null;
    } finally {
      connection.release();
    }
  }

  static async updateStatus(id, status, hostedEventId = null) {
    await this.ensureSchema();
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'UPDATE host_event_requests SET status = ?, hosted_event_id = COALESCE(?, hosted_event_id) WHERE id = ?',
        [status, hostedEventId, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return await this.findById(id);
    } finally {
      connection.release();
    }
  }
}

module.exports = HostEventRequest;
