import { Request, Response } from 'express';
import fs from 'fs';


interface Apparel {
    code: string;
    sizes: Size[];
}
  
interface Size {
    size: string;
    quantity: number;
    price: number;
}

interface ApparelData {
    apparel: Apparel[];
}

// Endpoint to get the lowest cost to fulfill the customer order.

module.exports.lowestCostOfOrder = (req: Request, res: Response) => {
    const order: { code: string; size: string; quantity: number }[] = req.body.order;
    const apparelData: ApparelData = JSON.parse(fs.readFileSync('./data/stock.json', 'utf8'));
  
    let totalCost = 0;
  
    order.forEach((item: any) => {
      const apparelItem = apparelData.apparel.find((apparel: any) => apparel.code === item.code);
      if (apparelItem) {
        const size = apparelItem.sizes.find((s: any) => s.size === item.size);
        if (size && size.quantity >= item.quantity) {
          totalCost += size.price * item.quantity;
        }
      }
    });
  
    res.json({ lowestCost: totalCost });
};

// Endpoint to check if the user can fufill the requirements of a customer order.

module.exports.canFulfillOrder = (req: Request, res: Response) => {
    const order: { code: string; size: string; quantity: number }[] = req.body.order;
    const apparelData: ApparelData = JSON.parse(fs.readFileSync('./data/stock.json', 'utf8'));
  
    // Check if each item in the order can be fulfilled
    const canFulfillOrder = order.every((item: any) => {
      const apparelItem = apparelData.apparel.find((apparel: any) => apparel.code === item.code);
      if (!apparelItem) 
        return false; // Item not found in the database
      const size = apparelItem.sizes.find((s: any) => s.size === item.size);
      return size && size.quantity >= item.quantity; // Check if number of size requested is available in stock
    });
  
    res.json({ canFulfillOrder });
  }