import { Carousel } from "@/components/carousel";
import { Hero } from "../features/hero";
import { AspectRatio, Heading, Text, VStack, Box } from "@chakra-ui/react";
import { Element } from "react-scroll";

export default function Home() {
  return (
    <VStack align="center" w="100%">
      <Hero />
      <Element name="modelos">
        <Box w="100%" px={{ base: 4, md: 8 }}>
          <Heading
            textAlign="center"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            marginY={10}
          >
            Seleccioná el hogar <Text as="b">que siempre soñaste</Text>
          </Heading>
        </Box>
      </Element>

      <Box w="100%">
        <Carousel />
      </Box>

      <Element name="ubicacion">
        <Box w="100%" px={{ base: 4, md: 8 }}>
          <Heading
            textAlign="center"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            marginY={10}
            fontWeight="bold"
          >
            Ubicación
          </Heading>
        </Box>
      </Element>

      <AspectRatio w="100%" maxW="1200px" ratio={16 / 9} px={{ base: 4, md: 8 }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1003.9861777624633!2d-84.158927!3d10.0189044!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0fb7fa497690f%3A0x5683d09c534e44d9!2sNaala!5e1!3m2!1ses-419!2scr!4v1737422865889!5m2!1ses-419!2scr"
          loading="lazy"
          style={{ borderRadius: "10px", border: 0 }}
        ></iframe>
      </AspectRatio>

      <Element name="contacto">
        <Box w="100%" px={{ base: 4, md: 8 }}>
          <Heading
            textAlign="center"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            marginY={10}
            fontWeight="bold"
          >
            Contacto
          </Heading>
        </Box>
      </Element>

      <VStack w="100%" px={{ base: 4, md: 8 }}>
        <Text
          textAlign="center"
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          marginY={10}
        >
          +506 2103-4245
        </Text>
      </VStack>
    </VStack>
  );
}
