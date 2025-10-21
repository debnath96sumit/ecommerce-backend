import { MessageBroker } from "../../utils/broker/Kafka";
import { MessageType, ProductEvent } from "../../types";
import { Product } from "../../models/Product";
import { IProduct } from "../../interfaces";

const getProductDetails = async (
  product_ids: string[],
  selectedFields?: string[],
): Promise<IProduct[]> => {
  const query = Product.find({
    _id: { $in: product_ids },
    status: "Active",
  });

  if (selectedFields && selectedFields.length > 0) {
    query.select(selectedFields.join(" "));
  }

  return await query.exec();
};


export const handleProductDetailsRequest = async (message: MessageType) => {
  const { product_ids, topic, selectedFields } = message.data;

  try {
    const products = await getProductDetails(product_ids, selectedFields);

    if (products.length > 0) {
      const productDetailsMap = products.reduce((acc, product) => {
        acc[product._id.toString()] = product;
        return acc;
      }, {} as Record<string, IProduct>);

      await MessageBroker.publish({
        topic,
        event: ProductEvent.GET_PRODUCTS_RESPONSE,
        message: {
          products: productDetailsMap
        },
      });
      console.log(`productDetailsResponse sent for product_id: ${product_ids}`);
    } else {
      console.error(`No product details found for product_id: ${product_ids}`);
      await MessageBroker.publish({
        topic,
        event: ProductEvent.GET_PRODUCTS_RESPONSE,
        message: {
          products: {}
        },
      })
    }
  } catch (error: any) {
    console.error(`Error handling productDetailsRequest: ${error.message}`);
    await MessageBroker.publish({
      topic,
      event: ProductEvent.GET_PRODUCTS_RESPONSE,
      message: {
        products: {}
      },
    })
  }
};
