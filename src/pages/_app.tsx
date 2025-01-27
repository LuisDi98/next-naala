import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { system } from "../../theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider value={system}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
