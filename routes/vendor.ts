import express from 'express';

const router = express.Router();

let { updateStockItem, updateStock } = require('../controllers/vendor_controller')


// vendor routes
router.put('/updateStockItem/:code/:size', updateStockItem);
router.put('/updateStock', updateStock);


module.exports = router;