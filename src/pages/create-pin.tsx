'use client'

import React, { useState } from "react";
import { VStack, Container, Heading, Box, Text, Button } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { generatePin } from "@/services/pin";
import useFormSetter from "../hooks/useFormSetter";
import { useRouter } from "next/router";

const CreatePin = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const [formState, setField] = useFormSetter({
    proyecto: "",
    finca: "",
    modelo: "",
    nombre: "",
    cedula: "",
    telefono: "",
    correo: "",
    adminPassword: "",
  });

  const models = [
    { label: "Modelo tipo 1", value: "Modelo_1" },
    { label: "Modelo tipo 2", value: "Modelo_2" },
    { label: "Modelo tipo 3", value: "Modelo_3" },
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: generatePin,
    onSuccess: () => {
      router.push("/pin");
    },
    onError: () => {
      setError("Hubo un error generando el PIN. Intenta de nuevo.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    for (const key in formState) {
      if (formState[key as keyof typeof formState].trim() === "") {
        setError("Todos los campos son obligatorios. Por favor, complétalos.");
        return;
      }
    }

    const adminSecretPass = process.env.NEXT_PUBLIC_ADMIN_SECRET_PIN_PASS;
    if (formState.adminPassword !== adminSecretPass) {
      setError("Contraseña de administrador incorrecta. No puedes generar un PIN.");
      return;
    }

    mutate(formState); 
  };

  return (
    <Container maxW="md" py={8}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "3xl" }} fontWeight="bold" textAlign="center" mb={6}>
            Formulario para PIN
          </Heading>

          {error && (
            <Text color="red.500" textAlign="center" fontWeight="bold">
              {error}
            </Text>
          )}

<Box>
            <label htmlFor="modelo" style={{ fontWeight: "bold", marginBottom: "8px", display: "block" }}>
              Selecciona un modelo
            </label>
            <select
              id="modelo"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                appearance: "none",
                backgroundColor: "white",
                cursor: "pointer",
              }}
              value={formState.modelo}
              onChange={(e) => setField("modelo")(e.target.value)}
            >
              <option value="" disabled>
                Selecciona un modelo
              </option>
              {models.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </Box>

          {[
            { name: "proyecto", placeholder: "Ingresa el proyecto" },
            { name: "finca", placeholder: "Ingresa la Finca Filial" },
            { name: "nombre", placeholder: "Ingresa el nombre del cliente" },
            { name: "cedula", placeholder: "Ingresa la cédula del cliente" },
            { name: "telefono", placeholder: "Ingresa el teléfono", type: "tel" },
            { name: "correo", placeholder: "Ingresa el correo del cliente", type: "email" },
            { name: "adminPassword", placeholder: "Ingrese la contraseña de administrador", type: "password" },
          ].map((field, index) => (
            <Box key={index}>
              <Text mb={1} fontWeight="bold">{field.placeholder}</Text>
              <input
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                name={field.name}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={formState[field.name as keyof typeof formState]}
                onChange={(e) => setField(field.name as keyof typeof formState)(e.target.value)}
              />
            </Box>
          ))}

          


          <Box pt={4}>
            <Button
              type="submit"
              colorScheme="blackAlpha"
              size="lg"
              width="full"
              isLoading={isPending}
            >
              Generar Pin
            </Button>
          </Box>
        </VStack>
      </form>
    </Container>
  );
};

export default CreatePin;
