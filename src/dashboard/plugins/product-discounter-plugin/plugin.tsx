import React, { type FC } from "react";
import type { plugins } from "@wix/stores/dashboard";
import { dashboard } from "@wix/dashboard";
import {
  Box,
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
  const { mostExpensiveProduct, isLoading } = useMostExpensiveProduct();

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Card>
        {isLoading && (
          <Card.Content>
            <Box align="center">
              <Loader />
            </Box>
          </Card.Content>
        )}
        {!isLoading && !mostExpensiveProduct && (
          <>
            <Card.Header title="Product Discounter" />
            <Card.Content>
              <Text>All products are on sale!</Text>
            </Card.Content>
          </>
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
                src={mostExpensiveProduct.media?.mainMedia?.image?.url}
                alt={mostExpensiveProduct.name}
                width={250}
              />
            }
            actions={
              <Button
                onClick={() => {
                  dashboard.navigate({
                    pageId: "0fe29310-c5f2-4aa1-9543-63a1c14b706f",
                    relativeUrl: "?productId=" + mostExpensiveProduct._id,
                  });
                }}
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
