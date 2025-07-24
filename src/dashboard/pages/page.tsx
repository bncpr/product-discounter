import React, { useEffect, useState, type FC } from "react";
import { dashboard } from "@wix/dashboard";
import {
  Box,
  Button,
  Card,
  Cell,
  FormField,
  Heading,
  Image,
  Input,
  Layout,
  Loader,
  Page,
  Text,
  TextButton,
  WixDesignSystemProvider,
} from "@wix/design-system";
import "@wix/design-system/styles.global.css";
import { products } from "@wix/stores";

const Index: FC = () => {
  const [product, setProduct] = useState<any>(null);
  const [discount, setDiscount] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dashboard.observeState(
      async (componentParams: {
        location: { pathname: string; search: string };
      }) => {
        const { pathname, search } = componentParams.location;
        const queryParams = new URLSearchParams(search);
        const pid = queryParams.get("productId");
        if (pid) {
          const response = await products.getProduct(pid);
          if (response && response.product) {
            setProduct(response.product);
          }
        }
      }
    );
  }, []);

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Page>
        <Page.Header title="Product Discounter" />
        <Page.Content>
          {!product && <Loader />}
          {product && (
            <Card>
              <Card.Header
                suffix={
                  <TextButton onClick={() => dashboard.navigateBack()}>
                    Back
                  </TextButton>
                }
                title={<Heading size="large">Most Expensive Product</Heading>}
              />
              <Card.Divider />
              <Card.Content>
                <Layout justifyItems="start">
                  <Cell rows={3} span={3}>
                    <Image
                      src={product.media?.mainMedia?.image?.url}
                      alt={product.name}
                      width={250}
                    />
                  </Cell>
                  <Cell span={9}>
                    <Box gap={1}>
                      <Heading size="medium">Name:</Heading>
                      <Text>{product.name}</Text>
                    </Box>
                    <Box gap={1}>
                      <Heading size="medium">Price:</Heading>
                      <Text>{`${product.priceData.price} ${product.priceData.currency}`}</Text>
                    </Box>
                  </Cell>
                  <Cell span={9}>
                    <Box direction="vertical" gap={1}>
                      <FormField label="Discount Percentage">
                        <Input
                          placeholder="Enter discount percentage"
                          type="number"
                          onChange={(e) => {
                            const value = e.target.value;
                            setDiscount(value ? parseFloat(value) : 0);
                          }}
                        />
                      </FormField>
                    </Box>
                  </Cell>
                  <Cell span={9}>
                    <Button
                      onClick={async () => {
                        if (discount && discount > 0 && discount <= 100) {
                          try {
                            setIsLoading(true);
                            await products.updateProduct(product._id, {
                              discount: {
                                type: "PERCENT",
                                value: discount,
                              },
                            });
                            dashboard.showToast({
                              message: "Discount applied!",
                              type: "success",
                            });
                          } catch (error) {
                            dashboard.showToast({
                              message:
                                "Failed to apply discount. Please try again.",
                              type: "error",
                            });
                          } finally {
                            setIsLoading(false);
                          }
                        } else {
                          dashboard.showToast({
                            message:
                              "Please enter a valid discount percentage.",
                            type: "error",
                          });
                        }
                      }}
                    >
                      {isLoading ? <Loader size="tiny" /> : "Discount Product"}
                    </Button>
                  </Cell>
                </Layout>
              </Card.Content>
            </Card>
          )}
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
};

export default Index;
