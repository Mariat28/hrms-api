const Log=require('../models/log');
const createLog = async(req,res)=>{
    try {
        const logData = {
            type: req.body.type,
            method: req.body.method,
            url: req.body.url,
            headers: JSON.stringify(req.body.headers),
            requestData: JSON.stringify(req.body.data),
            responseStatus: req.body.responseStatus,
            responseData: JSON.stringify(req.body.responseData),
            timestamp: req.body.timestamp
        };
    
        const log = await Log.create(logData);
        return res.status(201).json({message:`Log saved with ID: ${log.id}`});
      } catch (error) {
        console.error('Failed to save log:', error);
        return res.status(500).json({error:'Failed to save log'});
      }
}
const fetchLogs = async(req,res)=>{
    try{
        const logs= await Log.findAll();
        return res.status(200).json(logs);

    }catch(error){
        res.status(500).json({error: 'Error fetching api logs'});
    }
}
module.exports={createLog,fetchLogs}