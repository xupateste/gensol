import React from "react";
import {Box, Flex, Modal, Button, PseudoBox,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton, 
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogCloseButton,
  AlertDialogOverlay,
  useDisclosure} from "@chakra-ui/core";

import CheckIcon from "~/ui/icons/Check";
import CircleIcon from "~/ui/icons/Circle";
import TrashIcon from "~/ui/icons/Trash";
import {useToast} from "~/hooks/toast";

import {useOrders, useProductActions} from "~/product/hooks";

import Content from "~/ui/structure/Content";
import {useRouter} from "next/router";

const OrdersScreen: React.FC = () => {
  const orders = useOrders();
  const [, setStatus] = React.useState("init");
  const toast = useToast();
  const router = useRouter();
  //console.log(orders);
  const {remorder, updateorder} = useProductActions();
  const [orderkey, setOrderkey] = React.useState();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const alertDialog = useDisclosure()
  const cancelRef = React.useRef();

  const [message, setMessage] = React.useState();

  function handleOnOpenAlert(order) {
    alertDialog.onOpen();
    setOrderkey(order);
  }

  function handleRemoveOrder() {
    setStatus("pending");
    remorder(orderkey).catch(() => {
      setStatus("init");

      toast({status: "error", title: "Error", description: "No se pudo borrar la orden"});
    });
    alertDialog.onClose();
    setOrderkey(null);
  }

  function dateOrder(secs) {
    var t = new Date(null); // Epoch
    t.setSeconds(secs);
    var options = {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit"
    };
    return t.toLocaleDateString('es-PE', options);
  }

  function timeOrder(secs) {
    var t = new Date(null); // Epoch
    t.setSeconds(secs);
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const [, setIsRefreshing] = React.useState(false);
  const refreshDatas = () => {
    router.replace(router.asPath);
    setIsRefreshing(true);
  };
  React.useEffect(() => {
    setIsRefreshing(false);
  }, [orders]);

  const handleToggleCheck = (order) => {
    order.checked = !order.checked;
    updateorder(order);
  }

  return (
    <>
      <Flex direction="column" height="100%" marginTop={4}>
        <Box flex={1}>
          <Button width="100%" background='#fff' _hover={{ bg: '#fff' }} color='gray' onClick={refreshDatas}>
            Actualizar
          </Button>
          <Content padding={4}>
            <Box as="table" borderTopWidth={1} width="100%">
              <Box as="tbody">
                <Box as="tr" textAlign="left">
                  <Box as="th" width={10}>
                    
                  </Box>
                  <Box as="th">
                    ORDEN
                  </Box>
                  <Box as="th">
                    CLIENTE
                  </Box>
                  <Box as="th">
                    FECHA
                  </Box>
                  <Box as="th" width={5}>
                    
                  </Box>
                </Box>
                {orders.map((order) => (
                  <PseudoBox as="tr" key={order.id} marginBottom="10px" lineHeight={2} position="relative" color={order.checked ? "#b7b7b7" : ""}
                  _after={order.checked ? {
                          content: `""`,
                          position: "absolute",
                          left: "0",
                          width: "100%",
                          height: "2px",
                          marginTop: "16px",
                          bg: "#b7b7b7",
                          opacity: 0.6,
                      } : {content: `""`}}>
                    <Box as="td" width={10} onClick={() => handleToggleCheck(order)}>
                      {order.checked ? <CheckIcon /> : <CircleIcon />}
                    </Box>
                    <Box as="td" onClick={() => {onOpen();setMessage(order.message)}} textDecoration="underline" fontWeight="bold">
                      #{order.orderId}
                    </Box>
                    <Box as="td">
                      {order.fields ? order.fields[0].value : ''}
                    </Box>
                    <Box as="td">
                      {dateOrder(order.createdAt)} {timeOrder(order.createdAt)}
                    </Box>
                    <Box as="td" width={5} onClick={() => order.checked ? null : handleOnOpenAlert(order.id)}>
                      <TrashIcon />
                    </Box>
                  </PseudoBox>
                ))}
              </Box>
            </Box>
          </Content>
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {String(message).split("%0A").map((line, index)=>{
              return <Box fontWeight="bold" key={index}>{decodeURIComponent(line)}</Box>
            })}
          </ModalBody>
        </ModalContent>
      </Modal>
       <AlertDialog
        isOpen={alertDialog.isOpen}
        leastDestructiveRef={cancelRef}
        isCentered
        onClose={alertDialog.onClose}
      >
        <AlertDialogOverlay zIndex={8000}/>
        <AlertDialogContent zIndex={8001}>
          <AlertDialogHeader>Eliminar Orden</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Deseas eliminar la orden?<br/>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={alertDialog.onClose}>
              Cancelar
            </Button>
            <Button background='#E53E3E' _hover={{ bg: '#E53E3E' }} color='white' onClick={handleRemoveOrder} ml={3}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrdersScreen;
