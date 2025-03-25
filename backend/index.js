const express = require('express');
const { check } = require('express-validator');
const connectDB = require('./utils/conn');
const cors = require('cors');

const app = express();
const port = 3000;


connectDB();


app.use(cors());
app.use(express.json({ extended: false }));


const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const messoffRoutes = require('./routes/messoffRoutes');
const requestRoutes = require('./routes/requestRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hostel', hostelRoutes);  
app.use('/api/complaint', complaintRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/messoff', messoffRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/suggestion', suggestionRoutes);

// Server start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});