import { Response, Request } from "express";
import { AuthenticatedRequest, CreateCategoryInput } from "../interfaces";
import { CategoryRepository } from "../repositories";

class CategoryController {
  private readonly categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  public addCategory = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const checkCategory = await this.categoryRepo.findOne({
        name: req.body.name
      })

      if (checkCategory) {
        res.status(400).json({ message: "Category with this name already exists" });
        return;
      }
      const catData: CreateCategoryInput = {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        parent: req.body.parent ?? null,
      };
      const newProduct = await this.categoryRepo.create(catData);

      if (newProduct) {
        res.status(201).json({
          message: "Category added successfully",
          data: newProduct,
        });
        return;
      }

      res.status(500).json({ message: "Failed to add category" });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error adding category", error: error.message });
    }
  };
  public getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryRepo.find({});
      res.status(200).json({
        message: "Categories fetched successfully",
        data: categories,
      });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error adding category", error: error.message });
    }
  };
}

export default new CategoryController();
