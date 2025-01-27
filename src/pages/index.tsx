import { Carousel } from "@/components/carousel";
import { Hero } from "../features/hero";
import { AspectRatio, Heading, Text, VStack } from "@chakra-ui/react";
import { Element } from "react-scroll";

export default function Home() {
  return (
    <VStack align="center">
      <Hero />
      <Element name="modelos">
        <Heading
          textAlign="center"
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          margin={100}
        >
          Seleccioná el hogar <Text as="b" fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>que siempre soñaste</Text>
        </Heading>
      </Element>

      <Carousel />
      <Element name="ubicacion">
      <Heading
          textAlign="center"
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          margin={100}
          fontWeight="bold"
        >
          Ubicación
        </Heading>
      </Element>
      <AspectRatio w="100%" maxW="1200px" ratio={16 / 9}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1003.9861777624633!2d-84.158927!3d10.0189044!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0fb7fa497690f%3A0x5683d09c534e44d9!2sNaala!5e1!3m2!1ses-419!2scr!4v1737422865889!5m2!1ses-419!2scr"
          loading="lazy"
          style={{ borderRadius: "10px" }}
        ></iframe>
      </AspectRatio>
      <Element name="contacto">
      <Heading
          textAlign="center"
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          margin={100}
          fontWeight="bold"
        >
          Contacto
        </Heading>
      </Element>
      <VStack>
        <Text textAlign="center"
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          margin={100}
          >
            +506 2103-4245
          </Text>
      </VStack>
    </VStack>
  );
}
