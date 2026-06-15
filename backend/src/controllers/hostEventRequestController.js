const HostEventRequest = require('../models/HostEventRequest');
const Event = require('../models/Event');

const requiredFields = [
  'fullName',
  'email',
  'phoneNumber',
  'eventTitle',
  'eventCategory',
  'eventDescription',
  'eventDate',
  'eventTime',
  'eventLocation',
  'expectedParticipants',
];

const createHostEventRequest = async (req, res) => {
  try {
    const missingField = requiredFields.find((field) => !req.body[field]);
    if (missingField) {
      return res.status(400).json({ error: `${missingField} is required` });
    }

    if (!/^\S+@\S+\.\S+$/.test(req.body.email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const expectedParticipants = Number(req.body.expectedParticipants);
    if (!Number.isInteger(expectedParticipants) || expectedParticipants < 1) {
      return res.status(400).json({ error: 'Expected participants must be at least 1' });
    }

    const request = await HostEventRequest.create({
      ...req.body,
      expectedParticipants,
    });

    res.status(201).json({
      message: 'Host event request submitted successfully',
      request,
    });
  } catch (error) {
    console.error('Create host event request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getHostEventRequests = async (req, res) => {
  try {
    const requests = await HostEventRequest.findAll();
    res.json({ requests });
  } catch (error) {
    console.error('Get host event requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMyHostEventRequests = async (req, res) => {
  try {
    const requests = await HostEventRequest.findByEmail(req.user.email);
    res.json({ requests });
  } catch (error) {
    console.error('Get my host event requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateHostEventRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, eventData } = req.body;
    const validStatuses = ['approved', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    const existingRequest = await HostEventRequest.findById(id);
    if (!existingRequest) {
      return res.status(404).json({ error: 'Host event request not found' });
    }

    let hostedEvent = null;

    if (status === 'approved') {
      if (existingRequest.hosted_event_id) {
        return res.status(409).json({ error: 'This request has already been hosted as an event' });
      }

      const source = eventData || {};
      const title = source.title || existingRequest.event_title;
      const description = source.description || existingRequest.event_description;
      const eventDate = source.eventDate || `${existingRequest.event_date} ${existingRequest.event_time}`;
      const location = source.location || existingRequest.event_location;
      const capacity = Number(source.capacity || existingRequest.expected_participants);
      const category = source.category || existingRequest.event_category;
      const registrationDeadline = source.registrationDeadline || null;

      if (!title || !description || !eventDate || !location || !capacity || capacity < 1) {
        return res.status(400).json({ error: 'Valid event details are required before hosting' });
      }

      hostedEvent = await Event.create(
        title,
        description,
        eventDate,
        location,
        capacity,
        registrationDeadline,
        category
      );
    }

    const request = await HostEventRequest.updateStatus(id, status, hostedEvent?.id || null);
    if (!request) {
      return res.status(404).json({ error: 'Host event request not found' });
    }

    res.json({
      message: `Request ${status} successfully`,
      request,
      event: hostedEvent,
    });
  } catch (error) {
    console.error('Update host event request status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createHostEventRequest,
  getHostEventRequests,
  getMyHostEventRequests,
  updateHostEventRequestStatus,
};
