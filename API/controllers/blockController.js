const Block = require('../models/Blocks');
const responseService = require('../services/responseService');

exports.createBlock = async (req, res) => {
    try{
        const pageId = req.params.pageId;
        const block = req.body;
        const data = await Block.create(block);
        return res.status(201).json(responseService.createResponse({
            statusCode: 201,
            data,
            meta: { hasMany: false }
        }));
    }catch(err){
        return res.status(500).json(responseService.createResponse({
            statusCode: 500,
            message: 'Failed to create block',
            data: err
        }));
    }
}