import { Response } from "express";
import { AuthenticatedRequest, ICart, ICartInput } from "../interfaces";
import { CartRepository } from "../repositories/cart.repository";
import { isValidObjectId } from "mongoose";

class CartController {
  private readonly cartRepo: CartRepository;

  constructor() {
    this.cartRepo = new CartRepository();
  }

  public addToCart = async (req: AuthenticatedRequest, res: Response) => {
     try {
      const userId = req.user?.id; // from token middleware
      const { product_id, quantity, price } = req.body as ICartInput;

      let cart = await this.cartRepo.findOne({ user_id: userId });
      if (!cart) {
        cart = await this.cartRepo.create({
          user_id: userId,
          items: [],
          total_price: 0,
        });
      }

      const existingItem = cart.items.find((item) => item.product_id === product_id);
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = price;
      } else {
        cart.items.push({ product_id, quantity, price });
      }

      cart.total_price = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await cart.save();

      res.status(200).json({ success: true, message: 'Item added to cart', data: cart });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  };
}

export default new CartController();