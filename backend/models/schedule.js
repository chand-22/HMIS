import mongoose from 'mongoose';
const { Schema } = mongoose;

const DoctorScheduleSchema = new Schema({
  doctor_id: { type: Number, ref: 'Doctor' },
  day_of_week: { 
    type: String, 
    enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] 
  },
  start_time: String,
  end_time: String,
  slot_duration_minutes: Number,
  max_appointments_per_slot: { type: Number, default: 1 },
  is_active: { type: Boolean, default: true }
});

const DoctorBusySchema = new Schema({
  doctor_id: { type: Number, ref: 'Doctor' },
  exception_type: { 
    type: String, 
    enum: ["time_off", "surgery", "meeting", "emergency", "other"] 
  },
  start_datetime: Date,
  end_datetime: Date
}, { timestamps: true });

const DoctorSchedule = mongoose.model('DoctorSchedule', DoctorScheduleSchema);
const DoctorBusy = mongoose.model('DoctorBusy', DoctorBusySchema);

export { DoctorSchedule, DoctorBusy };