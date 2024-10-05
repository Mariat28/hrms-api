const Role= require('../models/role');

const fetchRoles=async(req,res)=>{
    try{
        const roles = await Role.findAll();
        res.status(200).json(roles);
    }catch(error){
        res.status(500).json({message:"Error fetching roles"});
    }
    
}

module.exports = {fetchRoles};