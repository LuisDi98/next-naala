const addPricesToModel = (modelName: string, categories: any[]) => {
  return categories.map((category: { questions: any[]; title: string; image: string }) => ({
    ...category,
    image: category.image?.replace("<Model>", modelName) || category.image,
    questions: category.questions.map((question: { options: any[]; text: string; id: string | number }) => {
      const priceData = modelPricing[modelName]?.[question.id];
      return {
        ...question,
        options: question.options.map((option: { name: string; image: string }) => {
          const price = priceData?.[option.name] ?? 0;
          return {
            ...option,
            price: price,
            image: option.image?.replace("<Model>", modelName) || option.image,
          };
          }),
      };
    })
  })
  )
};
  const mergeCategories = (
      baseCategories: { title: string; questions: any[] }[],
      additionalCategories: { title: string; questions: any[] }[]
  ) => {
      return [...baseCategories, ...additionalCategories].reduce((acc, category) => {
          const existingCategory = acc.find((cat: { title: string }) => cat.title === category.title);
          if (existingCategory) {
              existingCategory.questions = [...existingCategory.questions, ...category.questions];
          } else {
              acc.push(category);
          }
          return acc;
      }, [] as { title: string; questions: any[] }[]);
  };

  const model3Pricing = {
    1: { "Caramel": 0, "Roble Rustico": 0, "Roble provenza": 0 },
    2: { "Ambos": 649, "Ninguno": 0 },
    3: { "Si": 174, "No": 0 },
    4: { "Si": 193, "No": 0 },
    5: { "Si": 207, "No": 0 },
    6: { "Bahama Mate": 0, "Inter Mate": 0, "Tany Sand": 0 },
    7: { "Bahama Mate": 0, "Inter Mate": 0, "Tany Sand": 0 },
    8: { "Bahama Mate": 0, "Inter Mate": 0, "Tany Sand": 0 },
    9: { "London Ash": 0, "Geo avorio": 0, "Martin Blanco": 0 },
    10: { "London Ash": 0, "Geo avorio": 0, "Martin Blanco": 0 },
    11: { "Si": 841, "No": 0 },
    12: { "Sala principal": 41, "Comedor": 41, "Fregadero 1": 41, "Fregadero 2": 41, "Cocina": 41, "Entrada": 41 },
    13: { "Cuarto Principal": 41, "Pasillo": 41, "Escalera": 41 },
    14: { "Si": 1031, "No": 0 },
    20: { "Si": 737, "No": 0 },
    21: { 
      "Granito Blanco Báltico": 0, "Granito Gran Perla": 0,
      "Granito Gran Cuarzo Snow White": 0, "Cuarzo Vulcano": 87
     },
  };
  
  const modelPricing: any = {
    Modelo_1: {
      1: { "Caramel": 0, "Roble Rustico": 0, "Roble provenzal": 0 },
      2: { "Ambos": 649, "Ninguno": 0 },
      3: { "Si": 98, "No": 0 },
      4: { "Si": 193, "No": 0 },
      5: { "Si": 207, "No": 0 },
      6: { "Bahama Mate": 0, "Inter Mate": 0, "Tany Sand": 0 },
      7: { "Bahama Mate": 0, "Inter Mate": 0, "Tany Sand": 0 },
      8: { "Bahama Mate": 0, "Inter Mate": 0, "Tany Sand": 0 },
      9: { "London Ash": 0, "Geo avorio": 0, "Martin Blanco": 0 },
      10: { "London Ash": 0, "Geo avorio": 0, "Martin Blanco": 0 },
      11: { "Si": 841, "No": 0 },
      12: { "Comedor": 41, "Sala primer nivel": 41 },
      13: { "Cuarto Principal": 41, "Pasillo": 41, "Escalera": 41 },
      20: { "Si": 481, "No": 0 },
      21: { 
        "Granito Blanco Báltico": 0, "Granito Gran Perla": 0,
        "Granito Gran Cuarzo Snow White": 0, "Cuarzo Vulcano": 47
       },
    },
    Modelo_2: {
      1: { "Caramel": 0, "Roble Rustico": 0, "Roble provenzal": 0 },
      2: { "Ambos": 649, "Ninguno": 0 },
      3: { "Si": 121, "No": 0 },
      4: { "Si": 193, "No": 0 },
      5: { "Si": 207, "No": 0 },
      6: { "Bahama Mate": 0, "Inter Mate": 0, "Tany Sand": 0 },
      7: { "Bahama Mate": 0, "Inter Mate": 0, "Tany Sand": 0 },
      8: { "Bahama Mate": 0, "Inter Mate": 0, "Tany Sand": 0 },
      9: { "London Ash": 0, "Geo avorio": 0, "Martin Blanco": 0 },
      10: { "London Ash": 0, "Geo avorio": 0, "Martin Blanco": 0 },
      11: { "Si": 841, "No": 0 },
      12: { "London Ash": 0, "Geo avorio": 0, "Martin Blanco": 0 },
      13: { "Si": 841, "No": 0 },
      14: { "Sala principal": 41},
      15: { "Cuarto Principal": 41, "Escalera": 41, "Pasillo": 41 },
      16: { "Si": 497, "No": 0 },
      17: { "Si": 973, "No": 0 },
      20: { "Si": 591, "No": 0 },
      21: { 
        "Granito Blanco Báltico": 0, "Granito Gran Perla": 0,
        "Granito Gran Cuarzo Snow White": 0, "Cuarzo Vulcano": 56
       },
    },
    Modelo_3: { ...model3Pricing },
  };
  
  const baseModelData = {
    categories: [
      {
        title: "Acabados de Muebles",
        image: "/Naala_assets/Acabados_de_Muebles/mueble_recortado.png",
        questions: [
          {
            id: 1,
            text: "¿Qué tipo de acabados de muebles prefiere?",
            options: [
              { name: "Caramel", image: "/Naala_assets/Acabados_de_Muebles/CARAMEL.jpg" },
              { name: "Roble Rustico", image: "/Naala_assets/Acabados_de_Muebles/Roble Rustico.jpg" },
              { name: "Roble provenzal", image: "/Naala_assets/Acabados_de_Muebles/Roble Provenzal.jpeg" },
            ],
          },
          {
            id: 2,
            text: "Desea que se le empotre la plantilla y el horno?",
            tooltip: {
              description: "Buque y prevista para empotramiento: Se deja una prevista mediante un buque para el posterior empotramiento de los electrodomésticos. Ambos empotramientos deben realizarse juntos."
            },
            options: [
              { name: "Ambos", image: "/Naala_assets/Acabados_de_Muebles/<Model>/Empotrar plantilla y microondas.png", isEmbedded: true, },
              { name: "Ninguno", image: "/Naala_assets/Acabados_de_Muebles/<Model>/Empotrar plantilla y microondas.png" }
            ],
          },
        ],
      },
      {
        title: "Previstas Eléctricas",
        image: "/Naala_assets/base_bg.png",
        questions: [
          {
            id: 3,
            text: "¿Desea añadir una linea neutro adicional?",
            tooltip: {
              description: "Línea neutro adicional: Se recomienda bajo los siguientes escenarios:\n- Circuitos con alta carga: Si algunos circuitos tienen dispositivos de alto consumo energético.\n- Reducción de interferencias: En sistemas con varios equipos de uso simultáneo."
            },
            options: [
              { name: "Si", image: "/Naala_assets/base_bg.png" },
              { name: "No", image: "/Naala_assets/base_bg.png" }
            ],
          },
          {
            id: 4,
            text: "Desea una toma corriente de 220 v en la cochera?",
            tooltip: {
              description: "Alimentación para vehículo eléctrico: Recomendado si necesitas una toma eléctrica de 240 V, ya sea para un vehículo eléctrico o equipos que lo requieran."
            },
            options: [
              { name: "Si", image: "/Naala_assets/Previstas_Electricas/<Model>/Tomacorriente-220-adicional.png", isEmbedded: true, },
              { name: "No", image: "/Naala_assets/Previstas_Electricas/<Model>/Tomacorriente-220-adicional.png" }
            ],
          },
          {
            id: 5,
            text: "Desea una salida de calor para la secadora?",
            tooltip: {
              description: "Salida para secadora: Ideal si planeas usar una secadora de ropa. Incluye un ducto metálico de 4 pulgadas para la salida del aire caliente."
            },
            options: [
              { name: "Si", image: "/Naala_assets/Previstas_Electricas/<Model>/Salida de aire caliente.png", isEmbedded: true, },
              { name: "No", image: "/Naala_assets/Previstas_Electricas/<Model>/Salida de aire caliente.png" }
            ],
          },
          {
            id: 20,
            text: "¿Desea que se le instalen todas las luminarias de la casa?",
            options: [
              { name: "Si", image: "/Naala_assets/Previstas_Electricas/<Model>/luminarias.png", isEmbedded: true, },
              { name: "No", image: "/Naala_assets/Previstas_Electricas/<Model>/luminarias.png" }
            ],
          }
        ],
      },
      {
        title: "Acabados",
        image: "/Naala_assets/base_bg.png",
        questions: [
          {
            id: 6,
            text: "Como desea el enchape del piso general?",
            options: [
              { name: "Bahama Mate 60x60cm", image: "/Naala_assets/Acabados/Bahama Mate.jpeg" },
              { name: "Inter Mate 60x60cm", image: "/Naala_assets/Acabados/Inter Mate.jpeg" },
              { name: "Tany Sand 60x60cm", image: "/Naala_assets/Acabados/Tany Sand.jpeg" },
            ],
          },
          {
            id: 7,
            text: "Como desea el enchape de piso de baño cuarto principal?",
            options: [
              { name: "Bahama Mate 60x60cm", image: "/Naala_assets/Acabados/Bahama Mate.jpeg" },
              { name: "Inter Mate 60x60cm", image: "/Naala_assets/Acabados/Inter Mate.jpeg" },
              { name: "Tany Sand 60x60cm", image: "/Naala_assets/Acabados/Tany Sand.jpeg" },
            ],
          },
          {
            id: 8,
            text: "Como desea el enchape de piso de baño auxiliar?",
            options: [
              { name: "Bahama Mate 60x60cm", image: "/Naala_assets/Acabados/Bahama Mate.jpeg" },
              { name: "Inter Mate 60x60cm", image: "/Naala_assets/Acabados/Inter Mate.jpeg" },
              { name: "Tany Sand 60x60cm", image: "/Naala_assets/Acabados/Tany Sand.jpeg" },
            ],
          },
          {
            id: 9,
            text: "Como desea el enchape de paredes de ducha de cuarto principal?",
            options: [
              { name: "London Ash 30x60cm", image: "/Naala_assets/Acabados/London Ash.jpg" },
              { name: "Geo avorio 30x60cm", image: "/Naala_assets/Acabados/Geo Avorio.jpg" },
              { name: "Martin Blanco 30x60cm", image: "/Naala_assets/Acabados/Martin Blanco.jpg" },
            ],
          },
          {
            id: 10,
            text: "Como desea el enchape de paredes de ducha de baño auxiliar?",
            options: [
              { name: "London Ash 30x60cm", image: "/Naala_assets/Acabados/London Ash.jpg" },
              { name: "Geo avorio 30x60cm", image: "/Naala_assets/Acabados/Geo Avorio.jpg" },
              { name: "Martin Blanco 30x60cm", image: "/Naala_assets/Acabados/Martin Blanco.jpg" },
            ],
          }
        ]
      },
      {
        title: "Sobres",
        image: "/Naala_assets/base_bg.png",
        questions: [
          {
            id: 21,
            text: "Como desea el sobre?",
            options: [
              { name: "Granito Blanco Báltico", image: "/Naala_assets/Sobres/Blanco Baltico.jpeg" },
              { name: "Granito Gran Perla", image:  "/Naala_assets/Sobres/Gran Perla.jpeg" },
              { name: "Cuarzo Snow White", image: "/Naala_assets/Sobres/Snow White.jpeg" },
              { name: "Cuarzo Vulcano", image: "/Naala_assets/Sobres/Cuarzo Vulcano.jpeg" },
            ],
          },
        ]
      },
      {
        title: "Equipamiento",
        questions: [
          {
            id: 11,
            text: "Desea que se le suministre un calentador de agua de 12 Kw?",
            isEmbedded: true,
            tooltip: {
              description: "Calentador de agua: Recomendado para quienes deseen agua caliente mediante un tanque. Esta opción incluye un calentador instantáneo de 12 kW y la prevista necesaria."
            },
            options: [
              { name: "Si", image: "/Naala_assets/Equipamiento/<Model>/Calentador de agua.png", isEmbedded: true, },
              { name: "No", image: "/Naala_assets/Equipamiento/<Model>/Calentador de agua.png" },
            ],
          },
        ]
      }
    ],
  };

  const model1AdditionalQuestions = [
    {
      title: "Equipamiento",
      questions: [
        {
          id: 12,
          text: "Desea que se le refuerce el cielo raso del primer nivel?",
          checkboxFlag: true,
          image: "/Naala_assets/Equipamiento/Modelo_1/vanilla_primer_nivel.png",
          tooltip: {
            description: "Refuerzo en cielo raso: Recomendado para áreas donde se desee instalar luminarias pesadas, como lámparas colgantes o metálicas."
          },
          options: [
          
            { name: "Comedor", image: "/Naala_assets/Equipamiento/<Model>/comedor_pointer.png", isEmbedded: true },
            { name: "Sala primer nivel", image: "/Naala_assets/Equipamiento/<Model>/sala_pointer.png", isEmbedded: true },
            
          ],
        },
        {
          id: 13,
          text: "Desea que se le refuerce el cielo raso del segundo nivel?",
          checkboxFlag: true,
          image: "/Naala_assets/Equipamiento/Modelo_1/vanilla_segundo_nivel.png",
          isEmbedded: true,
          tooltip: {
            description: "Refuerzo en cielo raso: Recomendado para áreas donde se desee instalar luminarias pesadas, como lámparas colgantes o metálicas."
          },
          options: [
            { name: "Cuarto Principal", image: "/Naala_assets/Equipamiento/<Model>/habitacion_principal_pointer.png", isEmbedded: true, },
            { name: "Pasillo", image: "/Naala_assets/Equipamiento/<Model>/pasillo_pointer.png", isEmbedded: true, },
            { name: "Escalera", image: "/Naala_assets/Equipamiento/<Model>/escalera_pointer.png", isEmbedded: true, },
          ],
        },
      ],

    }
  ];
  
  const model2AdditionalQuestions = [
    {
      title: "Acabados de Muebles",
      questions: [
        {
          id: 16,
          text: "¿Desea que coloque un mueble aéreo sobre el fregadero?",
          options: [
            { name: "Si", image: "/Naala_assets/Acabados_de_Muebles/<Model>/Adicional-de-mueble-áereo-sobre-fregadero.png", isEmbedded: true, },
            { name: "No", image: "/Naala_assets/Acabados_de_Muebles/<Model>/Adicional-de-mueble-áereo-sobre-fregadero.png" }
          ],
        },
        {
          id: 17,
          text: "¿Desea que coloque un mueble aéreo sobre la refrigeradora?",
          options: [
            { name: "Si", image: "/Naala_assets/Acabados_de_Muebles/<Model>/Adicional de mueble áereo sobre refrigeradora.png", isEmbedded: true, },
            { name: "No", image: "/Naala_assets/Acabados_de_Muebles/<Model>/Adicional de mueble áereo sobre refrigeradora.png" }
          ],
        },
      ]
    },
    {
      title: "Equipamiento",
      questions: [
        {
          id: 14,
          text: "Desea que se le refuerce el cielo raso del primer nivel?",
          checkboxFlag: true,
          image: "/Naala_assets/Equipamiento/Modelo_2/vanilla_primer_nivel.png",
          isEmbedded: true,
          tooltip: {
            description: "Refuerzo en cielo raso: Recomendado para áreas donde se desee instalar luminarias pesadas, como lámparas colgantes o metálicas."
          },
          options: [
            { name: "Sala principal", image: "/Naala_assets/Equipamiento/Modelo_2/sala_pointer.png", isEmbedded: true, },            
          ],
        },
        {
          id: 15,
          text: "Desea que se le refuerce el cielo raso del segundo nivel?",
          checkboxFlag: true,
          isEmbedded: true,
          image: "/Naala_assets/Equipamiento/Modelo_2/vanilla_segundo_nivel.png",
          tooltip: {
            description: "Refuerzo en cielo raso: Recomendado para áreas donde se desee instalar luminarias pesadas, como lámparas colgantes o metálicas."
          },
          options: [
            { name: "Cuarto Principal", image: "/Naala_assets/Equipamiento/Modelo_2/habitacion_principal_pointer.png", isEmbedded: true, },
            { name: "Pasillo", image: "/Naala_assets/Equipamiento/Modelo_2/pasillo_pointer.png", isEmbedded: true, },
            { name: "Escalera", image: "/Naala_assets/Equipamiento/Modelo_2/escalera_pointer.png", isEmbedded: true, },
          ],
        },
      ]
    }
  ];
  
  const model3AdditionalQuestions = 
  [
    {
      title: "Equipamiento",
      questions: [
        {
          id: 12,
          text: "Desea que se le refuerce el cielo raso del primer nivel?",
          checkboxFlag: true,
          isEmbedded: true,
          image: "/Naala_assets/Equipamiento/Modelo_3/vanilla_primer_nivel.png",
          tooltip: {
            description: "Refuerzo en cielo raso: Recomendado para áreas donde se desee instalar luminarias pesadas, como lámparas colgantes o metálicas."
          },
          options: [
            { name: "Sala principal", image: "/Naala_assets/Equipamiento/Modelo_3/sala_pointer.png", isEmbedded: true, },
            { name: "Comedor", image: "/Naala_assets/Equipamiento/Modelo_3/comedor_pointer.png", isEmbedded: true, },
            { name: "Fregadero 1", image: "/Naala_assets/Equipamiento/Modelo_3/fregadero_pointer.png", isEmbedded: true, },
            { name: "Fregadero 2", image: "/Naala_assets/Equipamiento/Modelo_3/fregadero_2_pointer.png", isEmbedded: true, },
            { name: "Cocina", image: "/Naala_assets/Equipamiento/Modelo_3/cocina_pointer.png", isEmbedded: true, },
            { name: "Entrada", image: "/Naala_assets/Equipamiento/Modelo_3/entrada_pointer.png", isEmbedded: true, },           
          ],
        },
        {
          id: 13,
          text: "Desea que se le refuerce el cielo raso del segundo nivel?",
          checkboxFlag: true,
          isEmbedded: true,
          image: "/Naala_assets/Equipamiento/Modelo_3/vanilla_segundo_nivel.png",
          tooltip: {
            description: "Refuerzo en cielo raso: Recomendado para áreas donde se desee instalar luminarias pesadas, como lámparas colgantes o metálicas."
          },
          options: [
            { name: "Cuarto Principal", image: "/Naala_assets/Equipamiento/Modelo_3/habitacion_principal_pointer.png", isEmbedded: true, },
            { name: "Pasillo", image: "/Naala_assets/Equipamiento/Modelo_3/pasillo_pointer.png", isEmbedded: true, },
            { name: "Escalera", image: "/Naala_assets/Equipamiento/Modelo_3/escalera_pointer.png", isEmbedded: true, },
            
          ],
        },
        {
          id: 14,
          text: "Desea que se le construya una bodega bajo las gradas?",
          tooltip: {
            description: "Bodega bajo las gradas: La selección de la bodega incluye un punto de luz y un tomacorriente de 120 V."
          },
          options: [
            { name: "Si", image: "/Naala_assets/Equipamiento/<Model>/Bodega-bajo-gradas.png", isEmbedded: true, },
            { name: "No", image: "/Naala_assets/Equipamiento/<Model>/Bodega-bajo-gradas.png" },
          ],
        },
      ]
    },

  ];
  
  function deepClone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
  
  export const modelsData = [
    {
      model: "Modelo_1",
      image: "/modelo-1.jpg",
      categories: addPricesToModel("Modelo_1", 
        mergeCategories(deepClone(baseModelData.categories), deepClone(model1AdditionalQuestions)),
      ),
    },
    {
      model: "Modelo_2",
      image: "/modelo-2.jpg",
      categories: addPricesToModel(
        "Modelo_2",
        mergeCategories(deepClone(baseModelData.categories), deepClone(model2AdditionalQuestions))
      ),
    },
    {
      model: "Modelo_3",
      image: "/modelo-3.jpg",
      categories: addPricesToModel("Modelo_3", 
        mergeCategories(deepClone(baseModelData.categories), deepClone(model3AdditionalQuestions))
      ),
    },
  ];