const { Router } = require('express');
const typeRouter = Router();

const typeController = require('../controllers/typeController');

typeRouter.get('/', async (req, res) => {
    
    try {
        const types = await typeController.getAll();
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = typeRouter;