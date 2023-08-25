import { extendTheme } from "@chakra-ui/react";
//import "@fontsource/ibm-plex-sans";
export const theme = extendTheme({
    colors: {
        brand: {
            100: "#29CC98",
            900: "#1a202c",
        }
    },
    fonts: {
        body: `"IBM Plex Sans"`
    },
    styles: {
        global: () => ({
            body: {
                bg: "#F1F4F8",
                overflow: 'scroll',
            }
        })
    }
})