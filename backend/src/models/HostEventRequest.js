const db = require('../config/database');

class HostEventRequest {
  static async ensureSchema() {
    await db.query('ALTER TABLE host_event_requests ADD COLUMN IF NOT EXISTS hosted_event_id INTEGER REFERENCES events(id) ON DELETE SET NULL');
  }

  static async create(requestData) {
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

    const result = await db.query(
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, status`,
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

    return { id: result.rows[0].id, ...requestData, status: result.rows[0].status };
  }

  static selectFields() {
    return `SELECT
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
    FROM host_event_requests`;
  }

  static async findAll() {
    await this.ensureSchema();
    const result = await db.query(`${this.selectFields()} ORDER BY created_at DESC`);
    return result.rows;
  }

  static async findByEmail(email) {
    await this.ensureSchema();
    const result = await db.query(
      `${this.selectFields()} WHERE email = $1 ORDER BY created_at DESC`,
      [email]
    );
    return result.rows;
  }

  static async findById(id) {
    await this.ensureSchema();
    const result = await db.query(`${this.selectFields()} WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  static async updateStatus(id, status, hostedEventId = null) {
    await this.ensureSchema();
    const result = await db.query(
      `UPDATE host_event_requests
       SET status = $1,
           hosted_event_id = COALESCE($2, hosted_event_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id`,
      [status, hostedEventId, id]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return this.findById(id);
  }
}

module.exports = HostEventRequest;
