import { MessageBroker, PublishType } from './broker'

type WaitForResponseConfig<T> = {
  map: Map<string, T>;
  key?: string;
  expectedKeys?: string[];
  timeoutMs?: number;
  checkIntervalMs?: number;
};

type SendEventParams<T> = {
  publishData: PublishType;
  waitForResponse?: WaitForResponseConfig<T>;
};

export async function sendEvent<T>({
  publishData,
  waitForResponse,
}: SendEventParams<T>): Promise<T | Map<string, T> | boolean | null> {
  const published = await MessageBroker.publish(publishData);
  if (!published) {
    console.error("Failed to publish event:", publishData);
    return null;
  }

  if (!waitForResponse) return true;

  const {
    map,
    key,
    expectedKeys,
    timeoutMs = 1000,
    checkIntervalMs = 50,
  } = waitForResponse;

  // --- Single key mode ---
  if (key) {
    if (map.has(key)) {
      const result = map.get(key) ?? null;
      map.delete(key);
      return result;
    }

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        clearInterval(interval);
        resolve(null);
      }, timeoutMs);

      const interval = setInterval(() => {
        if (map.has(key)) {
          clearTimeout(timeout);
          clearInterval(interval);
          const result = map.get(key) ?? null;
          map.delete(key);
          resolve(result);
        }
      }, checkIntervalMs);
    });
  }

  // --- Multiple keys mode ---
  if (expectedKeys && expectedKeys.length > 0) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        clearInterval(interval);
        resolve(null);
      }, timeoutMs);

      const interval = setInterval(() => {
        const allAvailable = expectedKeys.every((k) => map.has(k));
        if (allAvailable) {
          clearTimeout(timeout);
          clearInterval(interval);
          const result = new Map<string, T>();
          expectedKeys.forEach((k) => {
            result.set(k, map.get(k)!);
            map.delete(k);
          });
          resolve(result);
        }
      }, checkIntervalMs);
    });
  }

  return null;
}
