const Event = require('../models/Event');

const createEvent = async (req, res) => {
  try {
    const { title, description, eventDate, location, capacity, registrationDeadline } = req.body;

    // Validation
    if (!title || !description || !eventDate || !location || capacity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (capacity < 1) {
      return res.status(400).json({ error: 'Capacity must be at least 1' });
    }

    const eventDateTime = new Date(eventDate);
    if (eventDateTime < new Date()) {
      return res.status(400).json({ error: 'Event date cannot be in the past' });
    }

    const event = await Event.create(title, description, eventDate, location, capacity, registrationDeadline);
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, startDate, endDate, category } = req.query;
    const events = await Event.findAll(parseInt(page), parseInt(limit), search, startDate, endDate, category);
    
    // Add remaining capacity to each event
    const eventsWithCapacity = events.map(event => ({
      ...event,
      remainingCapacity: event.capacity - event.registered_count,
      isUserRegistered: req.user ? req.user.isRegistered : false
    }));

    res.json({ events: eventsWithCapacity, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      ...event,
      remainingCapacity: event.capacity - event.registered_count
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if reducing capacity below current registrations
    if (updates.capacity && updates.capacity < event.registered_count) {
      return res.status(409).json({
        error: `Cannot reduce capacity below current registrations (${event.registered_count})`
      });
    }

    const updatedEvent = await Event.update(id, updates);
    res.json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await Event.delete(id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
