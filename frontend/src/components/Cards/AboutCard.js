import { Flex, Text, Link, Image, Divider, Stack, Show, Hide } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const AboutCard = () => {

    return (
        <>  
            <Flex flexDirection='row' flexWrap='wrap'>
                <Flex border="1px solid black" bgColor="white" flexDirection='column' p="30px">
                    <Stack>
                        <Text fontWeight={600} fontSize="18pt">About</Text>
                    </Stack>

                    <Flex mt={10} flexDirection={["column", "column", "row", "row"]}>
                        <Stack width={["100%", "100%", "50","50%"]}>
                            <Text fontWeight={600} fontSize="15pt">Gator Glaciology Lab</Text>
                            <Divider />
                            <Show below="md" justifyContent="center">
                                <Image display={["block", "block", "unset", "unset"]} mr="auto" ml="auto" pt={3} src='https://i.imgur.com/3egc4Cx.png' height="255px" width="255px" />
                            </Show>
                            <Text mb={4} pb={3} color="#525252" fontSize="11pt" pt={3}>The Gator Glaciology lab is focused on investigating the conditions beneath ice sheets and their influence on ice sheet evolution. We specialize in the development and application of machine learning tools for studying this environment. Areas of research include geophysical data analysis, geostatistical simulation, hydrological modeling, and geologic interpretation.
                            </Text>

                            <Link href="https://www.gatorglaciology.com/" target="_blank">
                                <Text color="#0E61FE">Learn more about the Gator Glaciology Lab →</Text>
                            </Link>
                        </Stack>
                        <Hide below="md">
                            <Flex width={["100%", "100%", "50","50%"]} justifyContent="right" align="center">
                                <Image mr={3} pt={3} src='https://i.imgur.com/3egc4Cx.png' height="255px" width="255px" />
                            </Flex>
                        </Hide>
                    </Flex>
                </Flex>
            </Flex>

        </>
    )
}
export default AboutCard;