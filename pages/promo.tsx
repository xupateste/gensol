import {useState} from 'react';
import React from "react";
import Image from "~/ui/feedback/Image";
import QrCode from "~/ui/feedback/QrCode2";
import styled from "@emotion/styled";
import {
  Box,
  Text,
  Input,
  Stack,
  Link,
  IconButton as ChakraIconButton,
  InputGroup,
  IconButtonProps,
  InputLeftAddon
} from "@chakra-ui/core";

const WhatsAppIcon = () => {
  return (
    <Box>
      <svg fill="white" height="100%" viewBox="0 0 24 24" width="100%" xmlns="http://www.w3.org/2000/svg">
        <path
          className="cls-1"
          d="M20.5 3.49a12 12 0 00-20.4 8.4 11.82 11.82 0 001.6 5.95L0 24l6.33-1.65A12 12 0 0012 23.79 11.94 11.94 0 0024 11.9a11.8 11.8 0 00-3.5-8.41zm-8.45 18.3A10 10 0 017 20.41l-.36-.21-3.76 1 1-3.65-.24-.37A9.88 9.88 0 0112.05 2a9.89 9.89 0 110 19.78zm5.45-7.4c-.3-.15-1.77-.87-2-1s-.47-.15-.67.15-.77 1-.95 1.17-.35.22-.65.07a8.17 8.17 0 01-2.4-1.47 9 9 0 01-1.66-2.06c-.17-.3 0-.46.13-.61s.3-.35.45-.52a2 2 0 00.3-.5.55.55 0 000-.52c-.14-.1-.74-1.58-.99-2.18s-.49-.5-.67-.51h-.57a1.1 1.1 0 00-.8.37A3.33 3.33 0 006 9.25a5.78 5.78 0 001.2 3.07 13.27 13.27 0 005.1 4.49 17.31 17.31 0 001.7.63 4.11 4.11 0 001.88.12 3.07 3.07 0 002-1.41 2.48 2.48 0 00.17-1.41c-.05-.13-.25-.21-.55-.36z"
        />
      </svg>
    </Box>
  );
};

const IconButton = styled(ChakraIconButton)`
  min-width: auto;
  min-height: auto;

  padding: 6px;

  svg {
    max-height: 20px;
    max-width: 20px;
  }
`;

const SocialIcon: React.FC<IconButtonProps> = (props) => (
  <IconButton
    isRound
    marginTop={-1}
    height="36"
    variantColor="green"
    width="36"
    {...props}
  />
);

const chat = ({}) => {
  
  const [message, setMessage] = useState('');

  function formatWP(code) {
    return 'https://wa.me/51935687208?text=Buenos%20días🤩%0D%0AConfirmo%20mi%20registro%20'+code;
  }

  const handleChange = event => {
    (""+event.target.value).length > 4 ? "" : setMessage(event.target.value.toUpperCase());
  };

  return (
    <Box
      p={4}
      borderWidth={2}
      margin={3}
      alignItems='center'
    > 
      <Stack
        align="stretch"
        textAlign="center"
        mt={{ base: 4, md: 0 }}
        ml={{ md: 6 }}
        alignItems='center'
      >
        <Box color='white' alignItems='center' marginTop={-4}>
          <Image
            height={150}
            width={150}
            src={"https://res.cloudinary.com/pency-d7d98/image/upload/v1654905088/CLOUDINARY_PRESET_LOW/a1kmqmcf3fdbebh2qlqo.png"}
          />
        </Box>
        <Stack mt={-6} alignItems="center" textAlign="center">
          <Text as="h1" color="black" fontSize="4xl" fontWeight="bold" lineHeight="90%">
            {"Lizeth Tellez"}
          </Text>
          <Text color="gray.700" fontSize="lg" fontWeight="bold" lineHeight="80%" zIndex={2}>
            {"ADMINISTRADORA"}
          </Text>
          <Text fontSize="3xl" fontWeight="bold" lineHeight="90%" marginTop={2} zIndex={2} alignItems="center" textAlign="center">
            <Link color="green" isExternal href={`https://wa.me/51935687208`}>
              <SocialIcon aria-label="Enviar mensaje por WhatsApp" gridArea="links" icon={WhatsAppIcon} /> 935 687 208
            </Link>
          </Text>
          <Text display="none" color="white" backgroundColor="#ff0000" p={1} fontSize="4xl" fontWeight="bold" lineHeight="90%" marginTop={2} zIndex={2} alignItems="center" textAlign="center">
            {"2% Dcto. 🎁"}
          </Text>
          <QrCode mt={-5} text={formatWP(message)}></QrCode>
          <InputGroup zIndex={3} mt={-5} fontWeight="bold"  >
            <InputLeftAddon color="gray.500" fontSize="4xl" fontWeight="bold"  children='#ID' />
            <Input size="lg" fontSize="4xl" fontWeight="bold"  placeholder='Ej.D16G' onChange={handleChange} value={message} type="text" maxLength={5} maxWidth={150}/>
          </InputGroup>
        </Stack>
      </Stack>
    </Box>
  );
};

export default chat;

