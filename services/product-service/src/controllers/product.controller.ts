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
      const {
        search,
        category,
        minPrice,
        maxPrice,
        inStock,
        featured,
        status,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filter: any = {};

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (category) {
        filter.category = category;
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      if (inStock === 'true') {
        filter.stock = { $gt: 0 };
      } else if (inStock === 'false') {
        filter.stock = { $lte: 0 };
      }

      if (featured) {
        filter.isFeatured = featured === 'true';
      }
      if (status) {
        filter.status = status;
      } else {
        filter.status = 'Active';
      }

      const pageNumber = Math.max(1, parseInt(page as string) || 1);
      const limitNumber = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
      const skip = (pageNumber - 1) * limitNumber;
      const sort: any = {};
      sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

      const [products, total] = await Promise.all([
        this.productRepo
          .getModel()
          .find(filter)
          .populate('category', 'name')
          .sort(sort)
          .skip(skip)
          .limit(limitNumber)
          .lean(),
        this.productRepo.getModel().countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limitNumber);

      res.status(200).json({
        success: true,
        data: {
          products,
          pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages
          }
        }
      });
    } catch (error: any) {
      console.error('Error listing products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching products',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
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
  public deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.params.id || !isValidObjectId(req.params.id)) {
        res.status(400).json({ message: "Product id is required" });
        return;
      }
      const vendor_id = req.user?.id;
      if (!vendor_id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const product = await this.productRepo.findOne({ _id: req.params.id, vendor_id });
      if(!product){
        res.status(404).json({ message: "Product not found or you are not authorized to delete this product" });
        return;
      }
      const deletedProduct = await this.productRepo.deleteById(product._id);
      res.status(200).json({ message: "Product deleted successfully", data: deletedProduct });
      return;
    } catch (error: any) {
      res.status(500).json({ message: "Error in delete product", error: error.message });
      return;
    }
  };
}

export default new ProductController();