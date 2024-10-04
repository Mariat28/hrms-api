const User = require('./user');
const Role = require('./role');

User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

module.exports = {
    User,
    Role,
};
