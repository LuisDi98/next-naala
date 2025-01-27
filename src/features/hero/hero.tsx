import { Box, Heading } from "@chakra-ui/react";
import Image from "next/image";
import BG from "../../../public/Naala_assets/bg-home.jpg";

export default function Hero() {
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="flex-end"
      justifyContent="flex-start"
      w="full"
      h="70vh"
      mt="-23px"
    >
      {/* Capa de opacidad con imagen de fondo */}
      <Box
        position="absolute"
        inset={0}
        bg="black"
        opacity={0.5}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${BG.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      />
      <Heading
        position="relative"
        color="black"
        fontSize={{ base: "3xl", md: "5xl" }}
        p={8}
        pb={40}
        shadow="2xl"
        zIndex={10}
      >
        Haz tu
        <br />
        <b>hogar único</b>
      </Heading>
    </Box>
  );
}
