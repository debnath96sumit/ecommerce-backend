import { Request, Response } from 'express';
import { IProduct } from '../interfaces';
import { ProductRepository } from '../repositories/product.repository';


class UserController {
    private readonly productRepo: ProductRepository;

    constructor() {
        this.productRepo = new ProductRepository();
    }

    public addProduct = async (req: Request, res: Response) => {
    try {
      const productData: IProduct = req.body;

      const newProduct = await this.productRepo.create(productData);

      if (newProduct) {
        res.status(201).json({
          message: 'Product added successfully',
          data: newProduct,
        });
        return;
      }

      res.status(500).json({ message: 'Failed to add product' });
      return;
    } catch (error: any) {
      res.status(500).json({ message: 'Error adding product', error: error.message });
    }
  };

}

export default new UserController();