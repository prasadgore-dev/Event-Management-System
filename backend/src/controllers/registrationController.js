const Registration = require('../models/Registration');
const Event = require('../models/Event');

const registerEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID required' });
    }

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check registration deadline
    if (event.registration_deadline) {
      const deadline = new Date(event.registration_deadline);
      if (deadline < new Date()) {
        return res.status(400).json({ error: 'Registration deadline has passed' });
      }
    }

    // Check if already registered
    const existing = await Registration.findByUserAndEvent(userId, eventId);
    if (existing) {
      return res.status(409).json({ error: 'Already registered for this event' });
    }

    // Create registration (handles capacity check with transaction)
    const result = await Registration.create(userId, eventId);
    
    if (result.error) {
      return res.status(result.code).json({ error: result.error });
    }

    res.status(201).json({ message: 'Registered successfully', registration: result });
  } catch (error) {
    console.error('Register event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const userId = req.user.id;

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Check ownership
    if (registration.user_id !== userId) {
      return res.status(403).json({ error: 'You can only cancel your own registrations' });
    }

    await Registration.delete(registrationId);
    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const registrations = await Registration.getEventRegistrations(eventId);
    res.json({ registrations });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;
    const registrations = await Registration.getUserRegistrations(userId);
    res.json({ registrations });
  } catch (error) {
    console.error('Get user registrations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  registerEvent,
  cancelRegistration,
  getEventRegistrations,
  getUserRegistrations,
};
