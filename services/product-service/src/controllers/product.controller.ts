import { Response } from "express";
import { AuthenticatedRequest, IProduct } from "../interfaces";
import { ProductRepository } from "../repositories/product.repository";
import { isValidObjectId } from "mongoose";

class ProductController {
  private readonly productRepo: ProductRepository;

  constructor() {
    this.productRepo = new ProductRepository();
  }

  public addProduct = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const productData: IProduct = req.body;
      const vendor_id = req.user?.id;
      if (!vendor_id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      productData.vendor_id = vendor_id;
      const newProduct = await this.productRepo.create(productData);

      if (newProduct) {
        res.status(201).json({
          message: "Product added successfully",
          data: newProduct,
        });
        return;
      }

      res.status(500).json({ message: "Failed to add product" });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error adding product", error: error.message });
    }
  };

  public listProducts = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const products = await this.productRepo.find({});
      res.status(200).json({ message: "Products fetched successfully", data: products });
      return;
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products", error: error.message });
      return;
    }
  };

  public productDetails = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.params.id || !isValidObjectId(req.params.id)) {
        res.status(400).json({ message: "Product id is required" });
        return;
      }
      const product = await this.productRepo.findById(req.params.id);
      res.status(200).json({ message: "Product fetched successfully", data: product });
      return;
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product detail", error: error.message });
      return;
    }
  };
}

export default new ProductController();