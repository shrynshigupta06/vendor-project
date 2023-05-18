import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());


// Endpoint to get the lowest cost to fulfill the customer order

app.get('/lowestcost', (req, res) => {
  const order = req.body.order;
  const apparelData = JSON.parse(fs.readFileSync('./data/stock.json', 'utf8'));

  let totalCost = 0;

  order.forEach((item: any) => {
    const apparelItem = apparelData.apparel.find(
      (apparel: any) => apparel.code === item.code
    );
    if (apparelItem) {
      const size = apparelItem.sizes.find(
        (size: any) => size.size === item.size
      );
      if (size && size.quantity > 0) {
        totalCost += size.price;
      }
    }
  });

  res.json({ lowestCost: totalCost });
});


// GET endpoint to check if the user can fufill the requirements of a customer order

app.get('/canFulfillOrder', (req, res) => {
  const order = req.body.order;
  const apparelData = JSON.parse(fs.readFileSync('./data/stock.json', 'utf8'));

  // Check if each item in the order can be fulfilled
  const canFulfillOrder = order.every((item: any) => {
    const apparelItem = apparelData.apparel.find(
      (apparel: any) => apparel.code === item.code
    );
    if (!apparelItem) 
      return false; // Item not found in the database
    const size = apparelItem.sizes.find(
      (size: any) => size.size === item.size
    );
    return size && size.quantity > 0; // Check if size is available in stock
  });

  res.json({ canFulfillOrder });
});


// Update stock quantity and price for an apparel code and size
app.put('/updateStockItem/:code/:size', (req, res) => {
  const { code, size } = req.params;
  const { quantity, price } = req.body;

  // Read the apparel data from the JSON file
  const apparelData = JSON.parse(fs.readFileSync('./data/stock.json', 'utf8'));

  // Find the apparel item by code
  const updatedApparelData = apparelData.apparel.map((item: any) => {
    if (item.code === code) {
      const updatedSizes = item.sizes.map((s: any) => {
        if (s.size === size) {
          return { ...s, quantity, price };
        }
        return s;
      });
      return { ...item, sizes: updatedSizes };
    }
    return item;
  });

  // Update the apparel data with the modified entry
  const updatedData = { ...apparelData, apparel: updatedApparelData };

  // Write the updated apparel data to the JSON file
  fs.writeFileSync('./data/stock.json', JSON.stringify(updatedData), 'utf8');

  return res.json({ message: 'Stock and price updated successfully' });
});


// Update stock quantity and price for multiple apparel codes and sizes
app.put('/updateStock', (req, res) => {
  const updates = req.body;

  // Read the apparel data from the JSON file
  const apparelData = JSON.parse(fs.readFileSync('./data/stock.json', 'utf8'));

  // Update the stock quantity and price for each apparel code and size
  updates.forEach((update: any) => {
    const { code, size, quantity, price } = update;
    const apparelItemIndex = apparelData.apparel.findIndex(
      (item: any) => item.code === code
    );

    if (apparelItemIndex !== -1) {
      const selectedSizeIndex = apparelData.apparel[apparelItemIndex].sizes.findIndex(
        (s: any) => s.size === size
      );

      if (selectedSizeIndex !== -1) {
        apparelData.apparel[apparelItemIndex].sizes[selectedSizeIndex].quantity = quantity;
        apparelData.apparel[apparelItemIndex].sizes[selectedSizeIndex].price = price;
      }
    }
  });

  // Write the updated apparel data to the JSON file
  fs.writeFileSync('./data/stock.json', JSON.stringify(apparelData), 'utf8');

  return res.json({ message: 'Stock and price updated successfully' });
});



app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});