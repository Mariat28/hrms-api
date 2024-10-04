const crypto = require('crypto');
const models = require('../models');
const { User, Role } = models;

// Function to generate a unique numeric employee number
async function generateEmployeeNumber(surname,otherName) {
    const randomComponent = Math.floor(Math.random() * 10000);
    const hashInput = `${surname}${otherName}${randomComponent}`;
    
    const hash = crypto.createHash('sha256').update(hashInput).digest('hex');
    const numericPart = parseInt(hash.slice(0, 5), 16) % 1000000;
    const employeeNumber = `DF${numericPart.toString().padStart(5, '0')}`;

    const exists = await User.findOne({ where: { employeeNumber } });
    if (exists) {
        return generateEmployeeNumber(userDetails);
    }
    return employeeNumber;
}

// User controller
const userController = {
    async createUser(req, res) {
        const { surname, otherName, photo, dateOfBirth, role_id } = req.body;
        if (!surname || !otherName || !role_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }else{
        try {

            // Generate a unique employee number
            const employeeNumber = await generateEmployeeNumber({ surname, otherName });

            // Ensure the photo is base64 encoded
            // Assuming the `photo` comes as a file path or raw data, convert it to base64
            let base64Photo;
            if (photo) {
                // If photo is a file path, read the file and convert it to base64
                if (typeof photo === 'string') {
                    const fs = require('fs');
                    const imageBuffer = fs.readFileSync(photo);
                    base64Photo = imageBuffer.toString('base64');
                } else {
                    // If photo is already in base64 format, use it directly
                    base64Photo = photo;
                }
            }

            const newUser = await User.create({
                surname,
                otherName,
                photo: base64Photo, // Store the base64 encoded photo
                employeeNumber,
                dateOfBirth,
                role_id
            });

            res.status(201).json({
                employeeNumber: newUser.employeeNumber,
                surname: newUser.surname,
                otherName: newUser.otherName,
                dateOfBirth: newUser.dateOfBirth
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }}
    },

    async getAllUsers(req, res) {
        try {
            const users = await User.findAll({
                include: {
                    model: Role,
                    attributes: ['role_name'],
                },
            });
            // Format the result to include role name with each user
        const result = users.map(user => ({
            employeeNumber: user.employeeNumber,
            surname: user.surname,
            otherName: user.otherName,
            dateOfBirth: user.dateOfBirth,
            roleName: user.Role.role_name, // Accessing the role name
        }));
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async updateUser(req, res) {
        try {
            const { photo, dateOfBirth,employeeNumber } = req.body;
            if(!employeeNumber){
                return res.status(400).json({ error: 'employeeNumber is mandatory!' })
            }
            const user = await User.findByPk(employeeNumber);
            if (!user) return res.status(404).json({ error: 'User not found' });
            const updateData = {};
            if (photo !== null && photo !== undefined) updateData.photo = photo;
            if (dateOfBirth !== null && dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
            if (Object.keys(updateData).length > 0) {
                await user.update(updateData);
            }
    
            res.status(200).json({
                employeeNumber: user.employeeNumber,
                surname: user.surname,
                otherName: user.otherName,
                dateOfBirth: user.dateOfBirth,
                photo: user.photo
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
};

module.exports = userController;
