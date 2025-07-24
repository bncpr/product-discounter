import { useEffect, useState } from "react";
import { products } from "@wix/stores";

async function fetchMostExpensiveProduct() {
  let allItems: any[] = [];
  let results = await products.queryProducts().find();
  allItems.push(...results.items);

  while (results.hasNext()) {
    results = await results.next();
    allItems.push(...results.items);
  }

  if (allItems.length > 0) {
    let mostExpensiveProduct = null;

    for (let i = 0; i < allItems.length; i++) {
      if (
        allItems[i].priceData.discountedPrice != allItems[i].priceData.price
      ) {
        continue; // Skip products with discounts
      }
      if (
        !mostExpensiveProduct ||
        allItems[i].priceData.price > mostExpensiveProduct.priceData.price
      ) {
        mostExpensiveProduct = allItems[i];
      }
    }
    return mostExpensiveProduct;
  } else {
    return null;
  }
}

export function useMostExpensiveProduct() {
  const [mostExpensiveProduct, setMostExpensiveProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const product = await fetchMostExpensiveProduct();
        setMostExpensiveProduct(product);
      } catch (error) {
        setMostExpensiveProduct(null);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { mostExpensiveProduct, isLoading };
}
