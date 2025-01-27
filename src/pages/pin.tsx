import { useState } from "react";
import { Box, Input, Flex, Text, IconButton } from "@chakra-ui/react";
import { Lock, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { verifyPin } from "@/services/pin"; // Import the API call
import { toaster } from "@/components/ui/toaster"; // Import the toaster utility
import { useRouter } from "next/router";

export default function PinInputField() {
  const router = useRouter();

  const [pin, setPin] = useState(""); // State for storing the entered PIN

  // useMutation for verifying PIN
  const { mutate: verify, isPending } = useMutation({
    mutationFn: verifyPin, // Ensure verifyPin is a properly defined async function
    onSuccess: (data) => {
      console.log(data);

      localStorage.setItem("pinData", JSON.stringify(data.pin));

      // Navigate to full URL when PIN is verified successfully
      router.push(`/modelos/${data.pin.modelo}`);
    },
    onError: (error) => {
      alert((error as any).response?.data?.message || "PIN no válido.");
      return false;
    },
  });


  const handleVerify = async () => {
    if (!pin) {
      alert("Por favor ingresa un PIN válido.");
      return;
    }
  
    try {
      verify({ pin });
    } catch (error) {
      console.error("Error controlado:", error);
    }
  };
  

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      h="80vh"
      bg="white"
      p={4}
    >
      <Text fontSize="6xl" fontWeight="regular">
        Ingresá <b className="font-bold">tu pin</b>
      </Text>
      <Box
        mt={6}
        bg="gray.100"
        p={4}
        borderRadius="md"
        boxShadow="md"
        w="sm"
        maxW="90%"
      >
        <Flex
          align="center"
          border="2px solid"
          borderColor="black"
          borderRadius="md"
          px={4}
          py={2}
          bg="white"
        >
          <Lock size={20} />
          <Input
            placeholder="Pin"
            ml={3}
            fontSize="lg"
            flex="1"
            value={pin}
            onChange={(e) => setPin(e.target.value)} // Update PIN state on input
          />
          <IconButton
            aria-label="Enviar"
            variant="ghost"
            color="black"
            _hover={{ bg: "gray.200" }}
            ml={2}
            loading={isPending}
            onClick={handleVerify} // Call handleVerify on click
          >
            <ArrowRight size={20} />
          </IconButton>

        </Flex>
      </Box>
    </Flex>
  );
}
