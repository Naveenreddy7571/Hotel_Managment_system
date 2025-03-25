const express = require('express');
const { check } = require('express-validator');
const { registerHostel } = require('../controllers/adminController');
const { getAllHostels } = require('../controllers/hostelController');
const router = express.Router();


router.post('/register-hostel', [
    check('name', 'Hostel name is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('rooms', 'Number of rooms is required').isInt({ min: 1 }),
    check('capacity', 'Capacity is required').isInt({ min: 1 }),
    check('vacant', 'Vacant rooms count is required').isInt({ min: 0 })
], registerHostel);


router.get('/hostels', getAllHostels);

module.exports = router;