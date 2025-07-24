import React, { type FC, useEffect, useState } from "react";
import type { plugins } from "@wix/stores/dashboard";
import { products } from "@wix/stores";
import {
  WixDesignSystemProvider,
  Card,
  Text,
  TextButton,
  Loader,
  Layout,
  Cell,
  Image,
  MarketingLayout,
  Button,
} from "@wix/design-system";
import "@wix/design-system/styles.global.css";

type Props = plugins.Products.ProductsBannerParams;

const Plugin: FC<Props> = (props) => {
  const [mostExpensiveProduct, setMostExpensiveProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMostExpensiveProduct() {
      setLoading(true);
      try {
        let allItems: any[] = [];

        let results = await products.queryProducts().find();
        allItems.push(...results.items);

        while (results.hasNext()) {
          results = await results.next();
          allItems.push(...results.items);
        }

        if (allItems.length > 0) {
          setMostExpensiveProduct(
            allItems.reduce((prev, current) => {
              return prev.priceData.price > current.priceData.price
                ? prev
                : current;
            })
          );
        } else {
          setMostExpensiveProduct(null);
        }
      } catch (error) {
        setMostExpensiveProduct(null);
      }
      setLoading(false);
    }
    fetchMostExpensiveProduct();
  }, []);

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Card>
        {loading && (
          <Card.Content>
            <Loader />
          </Card.Content>
        )}
        {mostExpensiveProduct && (
          <MarketingLayout
            title="Most Expensive Product"
            alignItems="stretch"
            size="medium"
            description={
              <Text>
                {mostExpensiveProduct.name}
                {": "}
                {mostExpensiveProduct.priceData.price}{" "}
                {mostExpensiveProduct.price.currency}
              </Text>
            }
            image={
              <Image
                src={mostExpensiveProduct.media.mainMedia.image.url}
                alt={mostExpensiveProduct.name}
                width={250}
              />
            }
            actions={
              <Button
              >
                Discount Product
              </Button>
            }
          />
        )}
      </Card>
    </WixDesignSystemProvider>
  );
};

export default Plugin;
