import React from "react";
import {Stack, Box, PseudoBox, Flex, useDisclosure, Text } from "@chakra-ui/core";
import BTT from "~/ui/icons/BTT";
import {useRouter} from "next/router";

import ProductCard from "../../components/ProductCard";
import {useFilteredProducts, useProducts} from "../../hooks";
import ProductsGrid from "../../components/ProductsGrid";
import ProductsCarousel from "../../components/ProductsCarousel";

import Onboarding from "./Onboarding";

//import Logo from "~/ui/static/Logo";
//import Image from "~/ui/feedback/Image";
import {useCart} from "~/cart/hooks";
import {groupBy} from "~/selectors/group";
import CartSummaryDrawer from "~/cart/components/CartSummaryDrawer";
import {filterBy} from "~/selectors/filter";
import {useTenant} from "~/tenant/hooks";
import {useTranslation} from "~/i18n/hooks";
import TenantHeader from "~/tenant/components/TenantHeader";
import NoResults from "~/ui/feedback/NoResults";
import Content from "~/ui/structure/Content";
import SummaryButton from "~/cart/components/SummaryButton";
import CartItemDrawer from "~/cart/components/CartItemDrawer";
import {Product, Variant} from "~/product/types";
import Link from "~/ui/controls/Link";


const ProductsScreen: React.FC = () => {
  const {
    query: {product, category},
    push,
  } = useRouter();
  const {add, increase, decrease, items, checkout, removeAll} = useCart();
  const t = useTranslation();
  const {isOpen: isCartOpen, onOpen: openCart, onClose: closeCart} = useDisclosure();
  const {products, filters} = useFilteredProducts((product) => product.type !== "hidden");
  const productsAll = useProducts();
  const {highlight, fields, layout, ...tenant} = useTenant();
  const selected = React.useMemo(() => products.find((_product) => _product.id === product), [
    products,
    product,
  ]);

  const featuredProducts = filterBy(products, {featured: true});
  const productsByCategory = groupBy(products, (product) => product.category);

  // added
  setTimeout(() => {
    document.querySelector<HTMLElement>(`[id="btt"]`) ? document.querySelector<HTMLElement>(`[id="btt"]`).style.display='none' : ""
  }, 0)
  
  let scrollPosition = 0
  window.onscroll = () => {
    scrollPosition = document.body.scrollTop || document.documentElement.scrollTop
    if (scrollPosition > 500) {
      document.querySelector<HTMLElement>(`[id="btt"]`).style.display='none' ? document.querySelector<HTMLElement>(`[id="btt"]`).style.display='block' : ''
    } else {
      document.querySelector<HTMLElement>(`[id="btt"]`).style.display='block' ? document.querySelector<HTMLElement>(`[id="btt"]`).style.display='none' : ''
    }
  };

  function scrollToCategory() {
    if(category) {
      setTimeout(() => {
        document
          .querySelector(`[id="${category}"]`)
          ?.scrollIntoView()
        var scrolledY = window.scrollY;
        if(scrolledY){
          //window.scroll(0, scrolledY - 60);
          window.scrollTo({ top: scrolledY - 60, behavior: 'smooth' });
        }
      }, 0)
    } 
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  //end added

  function handleAdd(product: Product, options: Variant[], count: number, note: string) {
    add(product, options, count, note);

   //push(`/`);
    push(`/`, `/`, {shallow: true});
  }

  function handleOpenCart() {
    openCart();
  }

  function handleCloseSelected() {
    //push(`/`);
   push(`/`, `/`, {shallow: true});
  }

  function handleSelect(product: Product) {
    push(
      {
        pathname: `/`,
        query: {
          product: product.id,
        },
      },
      {
        pathname: `/`,
        query: {
          product: product.id,
        },
      },
      {shallow: true},
    );
  }
  return (
    <>
      <Flex direction="column" height="100%">
        <Flex as="main" backgroundColor="white" direction="column" flex={1} height="100%">
          <Content height="100%" paddingX={{base: 0, sm: 4}}>
            <TenantHeader data-test-id="header" marginBottom={0} tenant={tenant} />
            <Box flex={1}>
              {highlight && (
                <Box
                  backgroundColor="primary.50"
                  color="primary.500"
                  fontSize={{base: "sm", sm: "md"}}
                  fontWeight="500"
                  marginTop={4}
                  paddingX={4}
                  paddingY={3}
                  roundedTop={{base: 0, sm: "lg"}}
                  textAlign={{base: "left", sm: "center"}}
                >
                  {highlight}
                </Box>
              )}
              <Box
                backgroundColor="gray.50"
                data-test-id="filters"
                marginBottom={{base: 5, sm: 10}}
                paddingX={4}
                paddingY={1}
                position="sticky"
                roundedBottom="lg"
                roundedTop={highlight ? "none" : "lg"}
                top={0}
                zIndex={3}
              >
                {filters}
              </Box>
              <Box marginBottom={4} paddingX={{base: 4, sm: 0}}>
                <Stack margin="auto" spacing={5} width="100%">
                  {Boolean(products.length) ? (
                    <Stack spacing={{base: 5, sm: 10}} width="100%">
                      {Boolean(featuredProducts.length) && (
                        <ProductsCarousel title={t("common.featured")} zIndex={0}>
                          {featuredProducts.map((product) => (
                            <ProductCard
                              key={product.id}
                              isRaised
                              layout="portrait"
                              minWidth={280}
                              product={product}
                              onClick={() => handleSelect(product)}
                            />
                          ))}
                        </ProductsCarousel>
                      )}
                      {productsByCategory.map(([category, products]) => {
                        return (
                          <PseudoBox key={category} as="section" id={category}>
                            <Text>Avc</Text>
                            <ProductsGrid data-test-id="category" layout={layout} title={category} products={products}>
                              {products.map((product) => (
                                <ProductCard
                                  key={product.id}
                                  layout={layout}
                                  product={product}
                                  onClick={() => handleSelect(product)}
                                />
                              ))}
                            </ProductsGrid>
                          </PseudoBox>
                        );
                      })}
                    </Stack>
                  ) : (
                    <NoResults data-test-id="empty">{t("products.empty")}</NoResults>
                  )}
                </Stack>
              </Box>
            </Box>
          </Content>
        </Flex>
        <Link id="btt" onClick={scrollToTop}>
            <Box position='fixed'
                bottom='70px'
                color="primary"
                right={['16px', '84px']}
                zIndex={1}
            >
                <BTT w={10} h={10} />
            </Box>
        </Link>
      </Flex>
      {Boolean(items.length) && (
        <Flex
          as="nav"
          bottom={0}
          justifyContent="center"
          margin={{base: 0, sm: "auto"}}
          paddingBottom={4}
          paddingX={4}
          position="sticky"
          width="100%"
          zIndex={4}
        >
          <Box
            display="block"
            margin={{base: 0, sm: "auto"}}
            minWidth={{base: "100%", sm: 64}}
            rounded={4}
            width={{base: "100%", sm: "auto"}}
          >
            <SummaryButton items={items} onClick={handleOpenCart}>
              {t("products.review")}
            </SummaryButton>
          </Box>
        </Flex>
      )}
      <Content>
        <Flex
          alignItems={{base: "center", sm: "flex-end"}}
          direction={{base: "column", sm: "row"}}
          justifyContent="flex-end"
          padding={4}
        >  
          <Stack w="100%" alignItems="center" spacing={1}>
            <Text fontSize="sm">{'Made by'} <Link fontWeight="bolder" href="https://wa.me/51930240108/?text=Hi+Chris!" isExternal>Chris</Link></Text>
          </Stack>
        </Flex>
      </Content>
      {isCartOpen && (
        <CartSummaryDrawer
          fields={fields}
          items={items}
          onCheckout={checkout}
          onRemoveAll={removeAll}
          onClose={closeCart}
          onDecrease={decrease}
          onIncrease={increase}
          products={productsAll}
        />
      )}
      {Boolean(selected) && (
        <CartItemDrawer product={selected} onClose={handleCloseSelected} onSubmit={handleAdd} />
      )}

      {scrollToCategory()}
      <Onboarding />
    </>
  );
};

export default ProductsScreen;