import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// Endpoint to get the lowest cost to fulfill an order
app.get('/lowestcost', (req, res) => {
  const order = req.body.order;
  console.log("req::: ", req.body);
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

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});