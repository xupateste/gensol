import React from "react";
import {
  Modal,
  Link,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Text,
  Stack,
  Flex,
} from "@chakra-ui/core";

const Onboarding = () => {
  const [isShown, setShown] = React.useState(
    process.browser ? !Boolean(window.localStorage?.getItem("onboarding:Products")) : false,
  );

  function handleClose() {
    window.localStorage.setItem("onboarding:Products", "completed");

    setShown(false);
  }

  if (!isShown) return null;

  return (
    <Modal isCentered onClose={handleClose}>
      <ModalOverlay backgroundColor="rgba(255,255,255,0.5)" zIndex={1400} />
      <ModalContent
        backgroundColor="transparent"
        bottom={{base: 0, sm: "auto"}}
        boxShadow="none"
        marginY={0}
        padding={4}
        position="absolute"
        top="auto"
      >
        <ModalCloseButton data-test-id="product-onboarding-close" right={6} top={6} />
        <ModalBody
          backgroundColor="primary.50"
          borderColor="primary.500"
          borderWidth={2}
          boxShadow="lg"
          padding={4}
          rounded="lg"
        >
          <Stack>
            <Stack spacing={0}>
              <Text fontSize="2xl" fontWeight="bold">
                Bienvenidos a FERRISUR
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                TENEMOS DE TODO PARA TU FERRETERIA
              </Text>
              <Text color="gray.600" marginTop={6}>Haz tu pedido fácil y rápido:</Text>
            </Stack>
            <Stack marginTop={2} spacing={6}>
              <Stack isInline alignItems="baseline" spacing={3}>
                <Flex
                  alignItems="center"
                  backgroundColor="primary.500"
                  borderRadius="50%"
                  color="white"
                  fontSize="sm"
                  height={6}
                  justifyContent="center"
                  lineHeight="1.5rem"
                  minWidth={6}
                  width={6}
                >
                  <Text>1</Text>
                </Flex>
                <Text>Elige los productos que quieras</Text>
              </Stack>
              <Stack isInline alignItems="baseline" spacing={3}>
                <Flex
                  alignItems="center"
                  backgroundColor="primary.500"
                  borderRadius="50%"
                  color="white"
                  fontSize="sm"
                  height={6}
                  justifyContent="center"
                  lineHeight="1.5rem"
                  minWidth={6}
                  width={6}
                >
                  <Text>2</Text>
                </Flex>
                <Text>Evalúa tu presupuesto y completa tu pedido</Text>
              </Stack>
              <Stack isInline alignItems="baseline" spacing={3}>
                <Flex
                  alignItems="center"
                  backgroundColor="primary.500"
                  borderRadius="50%"
                  color="white"
                  fontSize="sm"
                  height={6}
                  justifyContent="center"
                  lineHeight="1.5rem"
                  minWidth={6}
                  width={6}
                >
                  <Text>3</Text>
                </Flex>
                <Text>¡Listo! Generamos tu pedido para que lo recibamos por WhatsApp</Text>
              </Stack>
            </Stack>
            <Stack spacing={0}>
              <Text color="gray.600" marginTop={4}>Si tienes necesitas ayuda para completar tu Pedido <Link isExternal href={`https://wa.me/51930240108?text=Hola+Ferrisur!+Necesito+su+apoyo+para+completar+mi+Pedido+por+favor`}>escíbenos al WhatsApp</Link></Text>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Onboarding;
