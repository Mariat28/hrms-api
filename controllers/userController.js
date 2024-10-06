const crypto = require('crypto');
const models = require('../models');
const employeeOtp = require('../models/OTP');
const { User, Role } = models;

// Function to generate a unique numeric employee number
async function generateEmployeeNumber(surname, otherName) {
    let employeeNumber;
    let exists = true;

    while (exists) {
        const randomComponent = Math.floor(Math.random() * 10000);
        const hashInput = `${surname}${otherName}${randomComponent}`;
        const hash = crypto.createHash('sha256').update(hashInput).digest('hex');
        const numericPart = parseInt(hash.slice(0, 5), 16) % 1000000;
        employeeNumber = `DF${numericPart.toString().padStart(5, '0')}`;
        
        exists = await User.findOne({ where: { employeeNumber } });
    }

    return employeeNumber;
}

// User controller
const userController = {
    async createUser(req, res) {
        const { surname, otherName, photo, dateOfBirth, roleId, userOtp} = req.body;
        if (!surname || !otherName || !roleId || !dateOfBirth) {
            return res.status(400).json({ message: 'Missing required fields' });
        }        
        try {

            // Generate a unique employee number
            const employeeNumber = await generateEmployeeNumber(surname, otherName);

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
            if (OTPRecord) {
                await OTPRecord.destroy();
            } else {
                return res.status(400).json({ message: 'Invalid OTP or OTP not found.' });
            }            
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async getAllUsers(req, res) {
        if(req.query.employeeNumber){
            try{
                const user = await User.findOne({ where: { employeeNumber: req.query.employeeNumber },include:{model:Role,attributes:['role_name']} });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' })
                }else{
                    const userWithRole = user.get({ plain: true });
                    userWithRole.Role = user.Role.role_name;
                    return res.status(200).json(userWithRole);
                };
            }catch(error){
                return res.status(400).json({ message: 'error fetching user details' });
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
                roleId: user.Role.role_id,
                photo: user.photo
            }));
                return res.status(200).json(result);
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
        }

    },
    async updateUser(req, res) {
        try {
            const { photo, dateOfBirth,employeeNumber,roleId } = req.body;
            if(!employeeNumber || !roleId){
                return res.status(400).json({ message: 'employeeNumber and roleId are mandatory!' })
            }else if(!photo && !dateOfBirth && !roleId){
                return res.status(400).json({ message: 'Atleast two fields is required for update!' })
            }
            const user = await User.findByPk(employeeNumber);
            if (!user) return res.status(404).json({ message: 'User not found' });
            const updateData = {role_id:roleId};
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
            return res.status(400).json({ message: error.message });
        }
    }
    
};

module.exports = userController;
