import { Flex, Text, Link, Image, Divider, Stack, Show, Hide } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const MethodCard = () => {

    return (
        <>  
            <Flex flexDirection='row' flexWrap='wrap'>
                <Flex border="1px solid black" bgColor="white" flexDirection='column' p="30px">
                    <Stack>
                        <Text fontWeight={600} fontSize="18pt">Methodology</Text>

                        <Text mb={5} fontSize="11pt" mt={5} pt={5}><i>DEMOGORGN</i> utilizes Variogram generation and Simulation functions from the GStatSim Python Package to generate various realistic realizations of Greenland topography.</Text>
                    </Stack>

                    <Flex mt={10} flexDirection={["column", "column", "row", "row"]}>
                        <Stack width={["100%", "100%", "50","50%"]}>
                            <Text fontWeight={600} fontSize="15pt">GStatSim</Text>
                            <Divider />
                            <Show below="md">
                                <Image display={["block", "block", "unset", "unset"]} mr={3} pt={3} src='https://i.imgur.com/Kv6xVDl.jpg' height="255px" minWidth="380px" />
                            </Show>
                            <Text mb={4} pb={3} color="#525252" fontSize="11pt" pt={3}>GStatSim is a Python package specifically designed for geostatistical interpolation and simulation. It is inspired by open source geostatistical resources such as GeostatsPy and SciKit-GStat. The functions are intended to address the challenges of working with datasets with large crossover errors, non-linear trends, variability in measurement density, and non-stationarity. These tools are part of our ongoing effort to develop and adapt open-access geostatistical functions.
                            </Text>

                            <Link href="https://github.com/GatorGlaciology/GStatSim" target="_blank">
                                <Text color="#0E61FE">Visit the GitHub Repository →</Text>
                            </Link>
                            <Link href="https://pypi.org/project/gstatsim/" target="_blank" mt={2}>
                                <Text color="#0E61FE">View the package on PyPi →</Text>
                            </Link>
                        </Stack>
                        <Hide below="md">
                            <Flex width={["100%", "100%", "50","50%"]} justifyContent="right" align="center">
                                <Image mr={3} pt={3} src='https://i.imgur.com/Kv6xVDl.jpg' height="255px" minWidth="380px" />
                            </Flex>
                        </Hide>
                    </Flex>
                    {/* { isAuthenticated ?
                        <Text fontWeight={800}>Logout!</Text>
                        :
                        <Text fontWeight={800}>Login!</Text>
                    } */}
                </Flex>
                {/* <Flex width="50%" bgColor="white" padding="30px">
                    <Image src="https://i.imgur.com/d71xGIY.jpg" height="400px" minWidth="300px" />
                </Flex> */}
            </Flex>

        </>
    )
}
export default MethodCard;