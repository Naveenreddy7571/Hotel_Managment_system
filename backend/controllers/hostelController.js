

const Hostel = require('../models/Hostel');

// @route   GET api/hostels
// @desc    Get all hostels
// @access  Public
exports.getAllHostels = async (req, res) => {
    try {
        const hostels = await Hostel.find().sort({ name: 1 }); 
        res.json(hostels);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ 
            success: false, 
            errors: [{ msg: 'Server error while fetching hostels' }] 
        });
    }
};