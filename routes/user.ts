import express from 'express';

const router = express.Router();

let { lowestCostOfOrder, canFulfillOrder } = require('../controllers/user_controller')


// user routes
router.get('/lowestcost', lowestCostOfOrder);
router.get('/canFulfillOrder', canFulfillOrder);


module.exports = router;