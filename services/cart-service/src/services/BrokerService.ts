import { Consumer, Producer } from "kafkajs";
import { MessageBroker } from "../utils/broker/Kafka";
import { HandleProductEvent } from "../events/ProductEvents";

export const InitializeBroker = async (): Promise<void> => {
  const producer = await MessageBroker.connectProducer<Producer>();
  producer.on("producer.connect", () => {
    console.log("Producer connected successfully");
  });

  const consumer = await MessageBroker.connectConsumer<Consumer>();
  consumer.on("consumer.connect", () => {
    console.log("Consumer connected successfully");
  });

  await MessageBroker.subscribe(HandleProductEvent, 'CartEvents');
};
