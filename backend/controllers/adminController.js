const {generateToken, verifyToken} = require('../utils/auth');
const {validationResult} = require('express-validator');
const {Admin, User, Hostel} = require('../models');
const bcrypt = require('bcryptjs');

const registerAdmin = async (req, res) => {
    let success = false;

    // Check validation errors from request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { name, email, father_name, contact, address, dob, cnic, hostel, password } = req.body;

    try {
        // Check if admin already exists
        let existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success, errors: [{ msg: 'Admin already exists' }] });
        }

        // Find the hostel by name
        let shostel = await Hostel.findOne({ name: hostel });
        if (!shostel) {
            return res.status(400).json({ success, errors: [{ msg: 'Hostel not found' }] });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user record
        let user = new User({
            email,
            password: hashedPassword,
            isAdmin: true
        });

        await user.save();

        // Create new admin record
        let admin = new Admin({
            name,
            email,
            father_name,
            contact,
            address,
            dob,
            cnic,
            user: user._id,
            hostel: shostel._id // Use `_id` instead of `.id`
        });

        await admin.save();

        // Generate auth token
        const token = generateToken(user.id, user.isAdmin);

        success = true;
        res.json({ success, token, admin });

    } catch (error) {
        console.error("Error in registerAdmin:", error);
        res.status(500).json({ success, errors: [{ msg: 'Internal Server Error' }] });
    }
};

const updateAdmin = async (req, res) => {
    try {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array()});
        }

        const {name, email, father_name, contact, address, dob, cnic} = req.body;

        try {
            let admin = await Admin.findOne({email});

            if (!admin) {
                return res.status(400).json({success, errors: [{msg: 'Admin does not exists'}]});
            }

            admin.name = name;
            admin.email = email;
            admin.father_name = father_name;
            admin.contact = contact;
            admin.address = address;
            admin.dob = dob;
            admin.cnic = cnic;

            await admin.save();

            success = true;
            res.json({success, admin});

        } catch (error) {
            res.status(500).send('Server error');
        }
    } catch (err) {
        res.status(500).json({success, errors: [{msg: 'Server error'}]});
    }
}

const getHostel = async (req, res) => {
    try {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array()});
        }

        const {id} = req.body

        let admin = await Admin.findById(id);
        
        if (!admin) {
            return res.status(400).json({success, errors: [{msg: 'Admin does not exists'}]});
        }

        let hostel = await Hostel.findById(admin.hostel);
        success = true;
        res.json({success, hostel});
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const getAdmin = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array()});
    }
    try {
        const {isAdmin} = req.body;
        if (!isAdmin) {
            return res.status(401).json({success, errors: [{msg: 'Not an Admin, authorization denied'}]});
        }
        const {token} = req.body;
        if (!token) {
            return res.status(401).json({success, errors: [{msg: 'No token, authorization denied'}]});
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({success, errors: [{msg: 'Token is not valid'}]});
        }
        
        let admin = await Admin.findOne({user:decoded.userId}).select('-password');
        
        if (!admin) {
            return res.status(401).json({success, errors: [{msg: 'Token is not valid'}]});
        }

        success = true;
        res.json({success, admin});
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const deleteAdmin = async (req, res) => {
    try {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array()});
        }

        const {email} = req.body

        let admin = await Admin.findOne({email});

        if (!admin) {
            return res.status(400).json({success, errors: [{msg: 'Admin does not exists'}]});
        }

        const user = await User.findById(admin.user);

        await User.deleteOne(user);

        await Admin.deleteOne(admin);

        success = true;
        res.json({success, msg: 'Admin deleted'});
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const registerHostel = async (req, res) => {
    try {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        const { name, location, rooms, capacity, vacant } = req.body;

        try {
            // Check if hostel already exists
            let hostel = await Hostel.findOne({ name });
            if (hostel) {
                return res.status(400).json({ 
                    success, 
                    errors: [{ msg: 'Hostel with this name already exists' }] 
                });
            }

            // Validate room numbers
            if (vacant > rooms) {
                return res.status(400).json({
                    success,
                    errors: [{ msg: 'Vacant rooms cannot exceed total rooms' }]
                });
            }

            if (capacity < rooms) {
                return res.status(400).json({
                    success,
                    errors: [{ msg: 'Capacity cannot be less than total rooms' }]
                });
            }

            // Create new hostel
            hostel = new Hostel({
                name,
                location,
                rooms: parseInt(rooms),
                capacity: parseInt(capacity),
                vacant: parseInt(vacant)
            });

            await hostel.save();

            success = true;
            res.json({ success, hostel });

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, errors: [{ msg: 'Server error' }] });
    }
};


module.exports = {
    registerAdmin,
    updateAdmin,
    getAdmin,
    getHostel,
    deleteAdmin,
    registerHostel
}
