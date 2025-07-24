import React, { type FC } from "react";
import type { plugins } from "@wix/stores/dashboard";
import { dashboard } from "@wix/dashboard";
import {
  Button,
  Card,
  Image,
  Loader,
  MarketingLayout,
  Text,
  WixDesignSystemProvider,
} from "@wix/design-system";
import { useMostExpensiveProduct } from "./useMostExpensiveProduct";

import "@wix/design-system/styles.global.css";

type Props = plugins.Products.ProductsBannerParams;

const Plugin: FC<Props> = (props) => {
  const { mostExpensiveProduct } = useMostExpensiveProduct();

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Card>
        {!mostExpensiveProduct && (
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
