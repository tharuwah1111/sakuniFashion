import { Router } from 'express';
import { db } from '../database/db.js';

export const appointmentRouter = Router();

// GET /api/appointment
appointmentRouter.get('/', (req, res) => {
  const { approved } = req.query;
  const data = db.getData();

  let appointments = data.Appointment.filter(a => a.is_delete === 0);

  if (approved !== undefined && approved !== '') {
    appointments = appointments.filter(a => String(a.Approved) === String(approved));
  }

  appointments.sort((a, b) => new Date(a.Appoint_date).getTime() - new Date(b.Appoint_date).getTime());

  res.json(appointments);
});

// POST /api/appointment
appointmentRouter.post('/', (req, res) => {
  const { name, Appoint_date, number, Approved = 0 } = req.body;
  if (!name || !Appoint_date || !number) {
    return res.status(400).json({ error: 'Name, date, and contact number are required' });
  }

  const data = db.getData();
  const nextNum = data.Appointment.length + 1;
  const Appointment_id = `APT${String(nextNum).padStart(3, '0')}`;

  const newAppointment = {
    Appointment_id,
    name: String(name).trim(),
    Appoint_date,
    Approved: Number(Approved) || 0,
    is_delete: 0,
    number: String(number).trim(),
  };

  data.Appointment.push(newAppointment);
  db.save();

  res.status(201).json(newAppointment);
});

// PATCH /api/appointment/:id/approve
appointmentRouter.patch('/:id/approve', (req, res) => {
  const { id } = req.params;
  const { Approved } = req.body;
  const data = db.getData();

  const apt = data.Appointment.find(a => a.Appointment_id === id && a.is_delete === 0);
  if (!apt) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  apt.Approved = Approved !== undefined ? Number(Approved) : (apt.Approved === 1 ? 0 : 1);
  db.save();

  res.json({
    ...apt,
    message: apt.Approved === 1 ? 'Appointment confirmed' : 'Appointment marked pending',
  });
});

// PUT /api/appointment/:id
appointmentRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, Appoint_date, number, Approved } = req.body;
  const data = db.getData();

  const apt = data.Appointment.find(a => a.Appointment_id === id && a.is_delete === 0);
  if (!apt) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  if (name !== undefined) apt.name = String(name).trim();
  if (Appoint_date !== undefined) apt.Appoint_date = Appoint_date;
  if (number !== undefined) apt.number = String(number).trim();
  if (Approved !== undefined) apt.Approved = Number(Approved);

  db.save();

  res.json(apt);
});

// DELETE /api/appointment/:id
appointmentRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const data = db.getData();

  const apt = data.Appointment.find(a => a.Appointment_id === id && a.is_delete === 0);
  if (!apt) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  apt.is_delete = 1;
  db.save();

  res.json({ success: true, message: 'Appointment deleted successfully' });
});
