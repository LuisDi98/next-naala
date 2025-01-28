import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { Tooltip } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  CheckboxGroup
} from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox"
import { Radio, RadioGroup } from "@/components/ui/radio";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from "@chakra-ui/accordion";
import { Expand, Minimize } from "lucide-react";
import { Footer } from "@/features/footer";
import { modelsData } from "@/data/form";
import { motion } from "framer-motion";
const MotionImage = motion.img;
const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  content: {
    maxWidth: "400px",
    maxHeight: "250px",
    margin: "auto",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center" as "center",
  },
};

export default function ModelViewer() {
  const [isZoomed, setIsZoomed] = useState(false);
  const router = useRouter();
  const { model } : any = router.query;
  const [bgImage, setBgImage] = useState("/Naala_assets/base_bg.png");
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: [{ name: string; price: number }] }>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelData, setModelData] = useState<any>(null); // Cambiado de variable normal a estado

  useEffect(() => {
    if (!router.isReady) return; // Espera hasta que el router esté listo

    console.log("Model prints");
    console.log("model", model);
    
    const foundModel = modelsData.find((m: any) => m.model === model);
    setModelData(foundModel);
    console.log("modelsData", modelsData);
    console.log("modelData", foundModel);
    if (foundModel?.image) {
      setBgImage(foundModel.image);
    }
  }, [router.isReady, model]);
  useEffect(() => {
    const pinData = localStorage.getItem("pinData");
    if (!pinData) {
      setIsModalOpen(true);
    }
  }, []);
  const handleRedirect = () => {
    setIsModalOpen(false);
    router.push("/pin");
  };
  const toggleZoom = () => {setIsZoomed(!isZoomed);};
  if (!modelData) {
    return (
      <Flex direction="column" minH="100vh">
        <Box p={6} textAlign="center">
          <Text fontSize="2xl" color="red.500">
            Modelo "{model}" no encontrado.
          </Text>
        </Box>
      </Flex>
    );
  }
  const handleOptionChange = (selectedValue: string, question: any, questionOptions: any[]) => {
    const selectedOption = questionOptions.find(option => option.name === selectedValue);
    if (!selectedOption) return;
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = { ...prevSelectedOptions };
      updatedOptions[question.text] = [{ name: selectedOption.name, price: selectedOption.price }];
      updateTotalPrice(updatedOptions);
      if (selectedOption.image) {
        setBgImage(selectedOption.image);
      }
      return updatedOptions;
    });
  };
  const handleCheckboxChange = (option: any, isChecked: boolean, question: any) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions : any = { ...prevSelectedOptions };
      if (isChecked) {
        updatedOptions[question.text] = [...(updatedOptions[question.text] || []), { name: option.name, price: option.price }];
      } else {
        updatedOptions[question.text] = updatedOptions[question.text].filter((item:any) => item.name !== option.name);
        if (updatedOptions[question.text].length === 0) {
          delete updatedOptions[question.text];
        }
      }
      updateTotalPrice(updatedOptions);
      return updatedOptions;
    });
  };
  const updateTotalPrice = (options: { [key: string]: { name: string; price: number }[] }) => {
    const newTotalPrice = Object.values(options).reduce((total, optionArray) => {
      return total + optionArray.reduce((acc, item) => acc + item.price, 0);
    }, 0);
    setTotalPrice(newTotalPrice);
  };
  const handleCategoryClick = (category: any) => {
    if (category.image) {
      setBgImage(category.image);
    }
  };
  const handleValidation = () => {
    const requiredFields = modelData.categories.flatMap((category:any) =>
      category.questions.filter((question:any) => !question.checkboxFlag).map((q : any) => q.text)
    );
    const emptyFields = requiredFields.filter((field:any) => !selectedOptions[field]);
    if (emptyFields.length > 0) {
      alert(`Por favor complete todas las opciones antes de continuar: \n- ${emptyFields.join("\n- ")}`);
      return false;
    }
    return true;
  };
  return (
    <Box>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleRedirect}
        style={modalStyles}
        contentLabel="Error"
        ariaHideApp={false}
      >
        <Text fontSize="xl" fontWeight="bold" color="red.500">
          Error
        </Text>
        <Text mt={4} fontSize="md">
          No se encontraron datos del contrato. Debe ingresar su PIN antes de continuar.
        </Text>
        <Button 
          mt={6} 
          colorScheme="red" 
          onClick={handleRedirect}
          bg="red.200"
          color="black"
          _hover={{ bg: "red.300" }}
          p={5}
        >
          Ir a PIN
        </Button>
      </Modal>
      <Flex direction="column" minH="100vh">
        <Flex flex={1} direction={{ base: "column", lg: "row" }}>
          <Box flex={1} position="relative" p={4}>
            <Box 
              position="sticky"  
              top={0}            
              zIndex={10}        
              borderRadius="lg" 
              overflow="hidden"
              style={{ cursor: "pointer" }}
              onClick={toggleZoom}
            >
              <MotionImage
                key={bgImage}  
                src={bgImage}
                alt={`${modelData.model} Interior`}
                style={{
                  maxWidth: isZoomed ? "80%" : "100%",
                  maxHeight: isZoomed ? "90vh" : "800px",
                  width: "auto",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                  borderRadius: "10px",
                  objectFit: "contain",
                  transition: "all 0.5s ease-in-out",
                  transform: isZoomed ? "scale(1.5)" : "scale(1)",
                  cursor: "zoom-in",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
              />
              
              <Button 
                position="absolute" 
                top={4} 
                right={4} 
                size="sm" 
                colorScheme="blackAlpha"
                onClick={toggleZoom}
              >
                {isZoomed ? <Minimize color="#fff" /> : <Expand color="#fff" />}
              </Button>
            </Box>
          </Box>

          <Box w={{ base: "100%", lg: "500px" }} p={4} bg="transparent">
            <Flex direction="column" gap={10}>
              <Text fontSize="2xl" fontWeight="bold">
                Bienvenido, marque las opciones que desea agregar a su modelo.
              </Text>
              <Accordion allowToggle className="gap-8 p-5" defaultIndex={[0]}>
                {modelData.categories.map((category: any, categoryIndex: any) => (
                  <AccordionItem
                    key={categoryIndex}
                    bg="white"
                    _hover={{ boxShadow: "lg" }}
                    borderRadius="lg"
                    boxShadow="sm"
                    p={4}
                    marginY={4}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <h2>
                      <AccordionButton>
                        <Box
                          flex="1"
                          textAlign="left"
                          fontSize={{ base: "lg", md: "xl" }}
                          fontWeight="bold"
                        >
                          {category.title}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel padding={4}>
                      <Flex
                        direction="column"
                        gap={4}
                        flexWrap="wrap"
                        width="100%"
                        alignItems="flex-start"
                      >
                        {category.questions.map((question: any, questionIndex: any) => (
                          <Box
                            key={questionIndex}
                            padding={4}
                            bg="gray.50"
                            borderRadius="md"
                            border="1px solid"
                            borderColor="gray.200"
                            width="100%"
                          >
                            <Flex align="center" marginBottom={4} gap={2}>
                              <Text fontWeight="semibold" fontSize="md">
                                {question.text}
                              </Text>
                              {question.tooltip && (
                                <Tooltip content={question.tooltip.description}>
                                  <HelpCircle
                                    size={20}
                                    className="cursor-help text-gray-500 hover:text-gray-700"
                                  />
                                </Tooltip>
                              )}
                            </Flex>

                            {question.checkboxFlag ? (
                              <CheckboxGroup>
                                <VStack gap="2" align="start">
                                  {question.options.map((option: any, optionIndex: any) => (
                                    <Checkbox
                                      key={optionIndex}
                                      value={option.name}
                                      onCheckedChange={(event: any) =>
                                        handleCheckboxChange(option, event.checked, question)
                                      }
                                    >
                                      {option.name} - ${option.price}
                                    </Checkbox>
                                  ))}
                                </VStack>
                              </CheckboxGroup>
                            ) : (
                              <RadioGroup
                                onChange={(event: any) =>
                                  handleOptionChange(event.target.value, question, question.options)
                                }
                              >
                                <VStack gap="2" align="start">
                                  {question.options.map((option: any, optionIndex: any) => (
                                    <Radio key={optionIndex} value={String(option.name)}>
                                      <Text fontSize="md">
                                        {option.name} - ${option.price}
                                      </Text>
                                    </Radio>
                                  ))}
                                </VStack>
                              </RadioGroup>
                            )}
                          </Box>
                        ))}
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Flex>
          </Box>
        </Flex>

        <Footer handleValidation={handleValidation} totalPrice={totalPrice} selectedOptions={selectedOptions} />
      </Flex>
    </Box>
  );
}