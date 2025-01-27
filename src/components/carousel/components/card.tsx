import { Button, CardBody, CardFooter, CardHeader, CardRoot, Image, Text } from "@chakra-ui/react";
import Link from 'next/link'

interface PropertyCardProps {
  name: string;
  image: string;
}

export default function PropertyCard({ name, image }: PropertyCardProps) {
  return (
    <CardRoot bg="white" boxShadow="lg" borderRadius="lg">
      {/* Contenedor de Imagen */}
      <CardHeader p={0}>
        <Image 
          src={image || "/placeholder.svg"} 
          alt={name} 
          maxH="425px"
        />
      </CardHeader>

      <CardBody p={6} textAlign="center">
        <Text fontSize="2xl" fontWeight="bold" color="black">
          {name.replace(/_/g, " ")}
        </Text>
      </CardBody>

      <CardFooter justifyContent="center" gap={4} pb={6}>
        <Button 
          flex="1" 
          bgColor="#edddc3" 
          _hover={{ bg: "#edddc3" }} 
          color="stone.900" 
          fontWeight="bold"
        >
          <Link href={`/pin`}>Personalizar</Link>
        </Button>
        <Button 
          flex="1" 
          border="2px" 
          borderColor="black" 
          color="black" 
          _hover={{ bg: "gray.100" }} 
          fontWeight="bold"
        >
          <Link href="/">Detalles</Link>
        </Button>
      </CardFooter>
    </CardRoot>
  );
}
