import { useState } from "react";
import Modal from "react-modal";
import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { downloadDocx } from "@/services/contract";
import { toaster } from "../../components/ui/toaster";
import { useRouter } from "next/router";

const customModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  content: {
    width: "90%",
    maxWidth: "700px",
    minWidth: "320px",
    height: "auto",
    maxHeight: "90vh",
    margin: "auto",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 0px 20px rgba(0,0,0,0.3)",
    textAlign: "center" as "center",
    overflowY: "auto" as "auto",
  },
};

interface FooterProps {
  handleValidation: any;
  totalPrice: number;
  selectedOptions: { [key: string]: [{ name: string; price: number }] };
  listaAnexosRadio: string[];
  listaAnexosCheckbox: { base: string; overlays: string[] }[];
}

export default function Footer({ handleValidation, totalPrice, selectedOptions, listaAnexosRadio, listaAnexosCheckbox }: FooterProps) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // ⏳ Estado para la animación de carga
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleValidationForm = () => {
    if (handleValidation()) {
      setIsModalOpen(true);
    }
  };

  const handleAcceptContract = async () => {
    setIsProcessing(true); // ⏳ Iniciar animación
    console.time("⏳ Tiempo total de ejecución");

    const storedData = localStorage.getItem("pinData");
    if (!storedData) {
      toaster.create({
        description: "No se encontraron datos del contrato. Verifique el PIN.",
        type: "error",
      });
      setIsProcessing(false); // 🔴 Detener animación si hay error
      return;
    }

    console.time("📌 Recuperando datos del contrato");
    const pinData = JSON.parse(storedData);
    const fecha = new Date().toLocaleDateString();
    const { correo, modelo, nombre, finca, proyecto } = pinData;
    const clientEmail = correo;
    const propietario = nombre;
    console.timeEnd("📌 Recuperando datos del contrato");

    console.time("📄 Generando y descargando contrato");
    await downloadDocx(selectedOptions, clientEmail, fecha, finca, modelo, propietario, proyecto, listaAnexosRadio, listaAnexosCheckbox);
    console.timeEnd("📄 Generando y descargando contrato");

    console.time("🗑 Limpiando almacenamiento local y actualizando estado");
    localStorage.removeItem("pinData");
    setIsAccepted(true);
    console.timeEnd("🗑 Limpiando almacenamiento local y actualizando estado");

    console.timeEnd("⏳ Tiempo total de ejecución");

    setIsProcessing(false); // ✅ Finalizar animación
  };

  const handleFinish = () => {
    setIsModalOpen(false);
    router.push("/");
  };

  return (
    <Box as="footer" borderTop="1px" borderColor="gray.200" p={4} bg="white" w="100%" position="sticky" bottom="0" zIndex="10">
      <Container maxW="container.xl">
        <Flex justify="flex-end" align="flex-end" wrap="wrap" gap={4}>
          <Text mb={2.5} fontWeight="bold">Valor de extras: ${totalPrice.toLocaleString()}</Text>
          <Button
            bgColor="#000"
            color="#fff"
            size="lg"
            p={2}
            onClick={handleValidationForm}
          >
            Revisar
          </Button>
        </Flex>
      </Container>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customModalStyles}
        contentLabel="Resumen del contrato"
        ariaHideApp={false}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>
          Resumen del contrato
        </h2>

        {isProcessing ? ( // ⏳ Pantalla de carga cuando se genera el contrato
          <Center flexDirection="column">
            <Text fontWeight="bold" fontSize="lg" mb={4}>
              🔄 Generando contrato... Por favor, espere.
            </Text>
            <Spinner size="xl" color="blue.500" />
          </Center>
        ) : !isAccepted ? (
          <>
            <Text fontWeight="bold" mb={4}>
              Por favor verificar y confirmar sus personalizaciones, una vez confirmado se generará el contrato.
            </Text>
            <VStack align="start">
              {Object.entries(selectedOptions).map(([question, options], index) => (
                <Box key={index} p={3} border="1px solid #ddd" borderRadius="md" w="100%">
                  <Text fontWeight="bold">{question}</Text>
                  {options.map((option, idx) => (
                    <Box key={idx} ml={4}>
                      <Text>Opción: {option.name}</Text>
                      <Text>Costo: ${option.price.toLocaleString()}</Text>
                    </Box>
                  ))}
                </Box>
              ))}
            </VStack>
            <hr style={{ margin: "20px 0", border: "0.5px solid #ddd" }} />
            <Text fontWeight="bold" fontSize="xl">
              Total a pagar: ${totalPrice.toLocaleString()}
            </Text>
          </>
        ) : (
          <>
            <Text fontSize="lg" fontWeight="medium">
              Favor enviar la transferencia a la cuenta en dolares:
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="blue.500"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              p={2}
              textAlign="center"
              mt={2}
            >
              IBAN: CR21010200009317285965 <br /> BAC: 931728596
            </Text>
            <Text fontSize="lg" fontWeight="medium" mt={4}>
              Y envíe el comprobante al correo:
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="green.500" textAlign="center">
              personalizaciones@urbania.cr
            </Text>
          </>
        )}

        {!isProcessing && ( // 🛑 Ocultar botones mientras se genera el contrato
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
            {!isAccepted && (
              <Button
                bg="gray.200"
                color="black"
                _hover={{ bg: "green.300" }}
                padding={5}
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
            )}
            {!isAccepted ? (
              <Button
                bg="green.400"
                color="black"
                _hover={{ bg: "green.500" }}
                padding={5}
                onClick={handleAcceptContract}
              >
                Finalizar Contrato
              </Button>
            ) : (
              <Button
                bg="blue.200"
                color="black"
                _hover={{ bg: "blue.400" }}
                padding={5}
                onClick={handleFinish}
              >
                Listo
              </Button>
            )}
          </div>
        )}
      </Modal>
    </Box>
  );
}
