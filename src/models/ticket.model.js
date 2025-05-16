import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Para generar el código único

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4() // Generar un código único con UUID
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now // Fecha y hora actual
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
