import { Box, Flex } from "@chakra-ui/react";
import PropertyCard from "./components/card";
import { modelsData } from "@/data/form";

const properties = modelsData.map((model, index) => ({
  id: index + 1,
  name: model.model,
  image: model.image,
}));

export default function CustomCarousel() {
  return (
    <Box px={4} py={6}>
      <Flex 
        wrap="nowrap" 
        overflowX="auto" 
        gap={6} 
        py={6}
      >
        {properties.map((property) => (
          <Box 
            key={property.id}
            minW={{ base: "80%", sm: "60%", md: "40%", lg: "25%" }} 
            maxW="400px"
          >
            <PropertyCard name={property.name} image={property.image} />
          </Box>
        ))}
      </Flex>

    </Box>
  );
}
