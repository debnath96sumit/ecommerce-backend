import { Response } from "express";
import { AuthenticatedRequest, ICart, ICartInput, ICartItem } from "../interfaces";
import { CartRepository } from "../repositories/cart.repository";
import { isValidObjectId, Types } from "mongoose";
import { sendEvent } from "../utils/SendEvent";
import { CartEvent } from "../types";
import { productsDetailsMap } from "../events/EventDataStore";

class CartController {
  private readonly cartRepo: CartRepository;

  constructor() {
    this.cartRepo = new CartRepository();
  }

  public getMyCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const cart = await this.cartRepo.findOne({ user_id: userId });
      if (!cart) {
        res.status(404).json({ success: false, message: "Cart not found" });
        return;
      }
      const cartData = cart.toObject();
      
      if (cartData.items && cartData.items.length > 0) {
        const product_details = await sendEvent({
          publishData: {
            topic: "ProductEvents",
            event: CartEvent.GET_PRODUCTS_REQUEST,
            message: {
              product_ids: cartData.items.map((item: ICartItem) => item.product_id),
              topic: 'CartEvents',
              selectedFields: ['name', 'price']
            }
          },
          waitForResponse: {
            map: productsDetailsMap,
            expectedKeys: cartData.items.map((item: ICartItem) => item.product_id.toString())
          }
        });
        
        if (product_details) {
          cartData.items = cartData.items.map((item: ICartItem) => {
            const productDoc = product_details.get(item.product_id.toString());
            if (!productDoc) return item;

            const product = productDoc.toObject ? productDoc.toObject() : productDoc;

            console.log('product', product);

            return {
              ...item,
              product
            };
          });
        }
      }

      res.status(200).json({ success: true, data: cartData });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
  public addToCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { product_id, quantity } = req.body as ICartInput;

      if (!userId) {
        res.status(400).json({ success: false, message: 'User not found' });
        return;
      }

      const product_resp = await sendEvent({
        publishData: {
          topic: "ProductEvents",
          event: CartEvent.GET_PRODUCTS_REQUEST,
          message: {
            product_ids: [product_id],
            topic: 'CartEvents',
            selectedFields: ['name', 'price'],
          },
        },
        waitForResponse: {
          map: productsDetailsMap,
          expectedKeys: [product_id.toString()],
        },
      });

      console.log('product_respppppppppppp', product_resp);

      const product_details = product_resp?.get(product_id.toString());
      if (!product_details) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      const updatedCart = await this.cartRepo.addOrUpdateItem(
        userId,
        product_id,
        quantity,
        product_details.price
      );

      res.status(200).json({
        success: true,
        message: 'Item added/updated successfully',
        data: updatedCart,
      });
      return;
    } catch (error) {
      console.error('Error in addToCart:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }
  };

  public incrementItem = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { product_id } = req.params;
      if (!userId) {
        res.status(400).json({ success: false, message: 'User not found' });
        return;
      }
      const cart = await this.cartRepo.incrementItem(userId, new Types.ObjectId(product_id));
      if (!cart) {
        res.status(404).json({ success: false, message: 'Cart or item not found' });
        return;
      }

      res.status(200).json({ success: true, message: 'Quantity increased', data: cart });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  public decrementItem = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { product_id } = req.params;
      if (!userId) {
        res.status(400).json({ success: false, message: 'User not found' });
        return;
      }
      const cart = await this.cartRepo.decrementItem(userId, new Types.ObjectId(product_id));
      if (!cart) {
        res.status(404).json({ success: false, message: 'Cart or item not found' });
        return;
      }

      res.status(200).json({ success: true, message: 'Quantity decreased', data: cart });
      return;
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }
  };

  public removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { product_id } = req.params;

      if (!userId || !product_id) {
        res.status(400).json({ success: false, message: 'User and product ID are required' });
        return;
      }

      const cart = await this.cartRepo.removeItem(userId, new Types.ObjectId(product_id));

      if (!cart) {
        res.status(404).json({ success: false, message: 'Cart or product not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully',
        data: cart,
      });
      return;
    } catch (error) {
      console.error('Error in removeFromCart:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || 'Internal server error',
      });
      return;
    }
  };
}

export default new CartController();