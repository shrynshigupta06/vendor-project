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


// Update stock quantity and price for an apparel code and size

module.exports.updateStockItem = (req: Request, res: Response) => {
    const { code, size } = req.params;
    const { quantity, price } = req.body;
  
    // Read the apparel data from the JSON file
    const apparelData: ApparelData = JSON.parse(fs.readFileSync('./data/stock.json', 'utf8'));
  
    // Find the apparel item by code
    const updatedApparelData: ApparelData = {
        apparel: apparelData.apparel.map((apparel: any) => {
            if (apparel.code === code) {
                const updatedSizes = apparel.sizes.map((s: any) => {
                if (s.size === size) {
                    return { ...s, quantity, price };
                }
                return s;
                });
                return { ...apparel, sizes: updatedSizes };
            }
            return apparel;
        })
    };
  
    // Write the updated apparel data to the JSON file
    fs.writeFileSync('./data/stock.json', JSON.stringify(updatedApparelData), 'utf8');
  
    return res.json({ message: 'Stock and price updated successfully' });
};


// Update stock quantity and price for multiple apparel codes and sizes

module.exports.updateStock = (req: Request, res: Response) => {
    const updates = req.body as { code: string; size: string; quantity: number; price: number }[];
  
    // Read the apparel data from the JSON file
    const apparelData: ApparelData = JSON.parse(fs.readFileSync('./data/stock.json', 'utf8'));
  
    // Update the stock quantity and price for each apparel code and size
    updates.forEach((update: any) => {
      const { code, size, quantity, price } = update;
      const apparelItemIndex = apparelData.apparel.findIndex((apparel: any) => apparel.code === code);
  
      if (apparelItemIndex !== -1) {
        const selectedSizeIndex = apparelData.apparel[apparelItemIndex].sizes.findIndex((s: any) => s.size === size);
  
        if (selectedSizeIndex !== -1) {
          apparelData.apparel[apparelItemIndex].sizes[selectedSizeIndex].quantity = quantity;
          apparelData.apparel[apparelItemIndex].sizes[selectedSizeIndex].price = price;
        }
      }
    });
  
    // Write the updated apparel data to the JSON file
    fs.writeFileSync('./data/stock.json', JSON.stringify(apparelData), 'utf8');
  
    return res.json({ message: 'Stock and price updated successfully' });
};
