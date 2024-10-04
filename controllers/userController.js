const crypto = require('crypto');
const models = require('../models');
const employeeOtp = require('../models/OTP');
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
        const { surname, otherName, photo, dateOfBirth, roleId, userOtp} = req.body;
        if (!surname || !otherName || !roleId || !dateOfBirth) {
            return res.status(400).json({ error: 'Missing required fields' });
        }else{
        try {

            // Generate a unique employee number
            const employeeNumber = await generateEmployeeNumber({ surname, otherName });

            const newUser = await User.create({
                surname,
                otherName,
                photo: photo,
                employeeNumber,
                dateOfBirth,
                role_id:roleId
            });

            res.status(201).json({
                employeeNumber: newUser.employeeNumber,
                surname: newUser.surname,
                otherName: newUser.otherName,
                dateOfBirth: newUser.dateOfBirth
            });
            // Find the OTP record
            const OTPRecord = await employeeOtp.findOne({where: {OTP: userOtp}});
            await OTPRecord.destroy();
            
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }}
    },

    async getAllUsers(req, res) {
        if(req.query.employeeNumber){
            try{
                const user = await User.findByPk(req.query.employeeNumber);
                if (!user) {
                    return res.status(404).json({ error: 'User not found' })
                }else{
                    return res.status(200).json(user);
                };
            }catch(error){
                return res.status(400).json({ error: 'error fetching user details' });
            }
        }else{
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
                roleName: user.Role.role_name,
            }));
                return res.status(200).json(result);
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
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
