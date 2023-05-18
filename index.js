"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var fs_1 = require("fs");
var app = (0, express_1.default)();
var PORT = 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Endpoint to update the stock quality and price of one apparel code and size
app.put('/stock/:code/:size', function (req, res) {
    var _a = req.params, code = _a.code, size = _a.size;
    var _b = req.body, quality = _b.quality, price = _b.price;
    // Load stock data from the JSON file
    var stock = JSON.parse(fs_1.default.readFileSync('./data/stock.json', 'utf8'));
    // Find the apparel item with the matching code and size
    var item = stock.find(function (item) { return item.code === code && item.size === size; });
    if (item) {
        // Update the quality and price
        item.quality = quality;
        item.price = price;
        // Save the updated stock data to the JSON file
        fs_1.default.writeFileSync('./data/stock.json', JSON.stringify(stock));
        res.sendStatus(200);
    }
    else {
        res.sendStatus(404);
    }
});
// Endpoint to update the stock quality and price of several apparel codes and sizes
app.put('/stock', function (req, res) {
    var updates = req.body;
    // Load stock data from the JSON file
    var stock = JSON.parse(fs_1.default.readFileSync('./data/stock.json', 'utf8'));
    updates.forEach(function (update) {
        var code = update.code, size = update.size, quality = update.quality, price = update.price;
        var item = stock.find(function (item) { return item.code === code && item.size === size; });
        if (item) {
            // Update the quality and price
            item.quality = quality;
            item.price = price;
        }
    });
    // Save the updated stock data to the JSON file
    fs_1.default.writeFileSync('./data/stock.json', JSON.stringify(stock));
    res.sendStatus(200);
});
// Endpoint to check if the requirement of a customer order can be fulfilled
app.post('/fulfill', function (req, res) {
    var order = req.body;
    // Load stock data from the JSON file
    var stock = JSON.parse(fs_1.default.readFileSync('./data/stock.json', 'utf8'));
    var canFulfill = true;
    order.forEach(function (item) {
        var code = item.code, size = item.size, quantity = item.quantity;
        var stockItem = stock.find(function (stockItem) { return stockItem.code === code && stockItem.size === size; });
        if (!stockItem || stockItem.quality < quantity) {
            canFulfill = false;
        }
    });
    res.json({ canFulfill: canFulfill });
});
// Endpoint to get the lowest cost to fulfill an order
app.post('/lowestcost', function (req, res) {
    var order = req.body;
    // Load stock data from the JSON file
    var stock = JSON.parse(fs_1.default.readFileSync('./data/stock.json', 'utf8'));
    var lowestCost = 0;
    order.forEach(function (item) {
        var code = item.code, size = item.size, quantity = item.quantity;
        var stockItem = stock.find(function (stockItem) { return stockItem.code === code && stockItem.size === size; });
        if (stockItem) {
            lowestCost += stockItem.price * quantity;
        }
    });
    res.json({ lowestCost: lowestCost });
});
app.listen(PORT, function () {
    console.log("Server is listening on port ".concat(PORT));
});
