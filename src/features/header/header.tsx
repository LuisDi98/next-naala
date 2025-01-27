import Link from 'next/link';
import { Link as ScrollLink } from "react-scroll";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Box, Flex, IconButton, Image, List, ListItem, Text } from "@chakra-ui/react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    {
      href: "https://maps.app.goo.gl/CMRA6WFtrn2EDhQY6",
      text: "Ubicación",
      isExternal: true,
    },
    {
      href: "modelos",
      text: "Modelos",
      isExternal: false,
    },
    {
      href: "contacto",
      text: "Contacto",
      isExternal: false,
    },
  ];

  return (
    <Box as="header" w="full" px={4} py={4} bg="black" color="white">
      <Flex maxW="container.xl" mx="auto" justify="space-between" align="center">
        <Link href="/">
          <Image width={150} src="/naala-logo.png" alt="Naala Logo" />
        </Link>

        <IconButton
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          display={{ base: "block", md: "none" }}
          onClick={() => setMenuOpen(!menuOpen)}
          bg="transparent"
          color="white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </IconButton>

        <Box
          display={{ base: menuOpen ? "flex" : "none", md: "flex" }}
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
          gap={{ base: 4, md: 8, lg: 12 }}
          position={{ base: "absolute", md: "static" }}
          top={16}
          left={0}
          right={0}
          bg={{ base: "black", md: "transparent" }}
          p={{ base: 4, md: 0 }}
          boxShadow={{ base: "lg", md: "none" }}
          zIndex={50}
        >
          {links.map(({ text, href, isExternal }, index) => (
            isExternal ? (
              <Link key={index} href={href} passHref legacyBehavior>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "lg", fontWeight: "bold", textDecoration: "none" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {text}
                </a>
              </Link>
            ) : (
              <ScrollLink
                key={index}
                to={href}
                smooth={true}
                duration={500}
                spy={true}
                offset={-70}
                style={{ cursor: "pointer", fontSize: "lg", fontWeight: "bold", color: "white", textDecoration: "none" }}
                onClick={() => setMenuOpen(false)}
              >
                {text}
              </ScrollLink>
            )
          ))}
        </Box>
      </Flex>
    </Box>
  );
}
