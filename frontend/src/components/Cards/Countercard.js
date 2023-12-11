import React from 'react';
import { Text, Tag, Flex, Link, Hide } from '@chakra-ui/react'
const CounterCard = () => {
    
    return (
        <Hide below="md">
            <Flex flexDirection='row' bgColor='#161616' height="130px" p={5} mt={5}>
                <Flex width="75%" flexDirection='row'>
                    <Flex flexDirection='column' width="24%">
                        <Text ml={5} color='white' fontWeight={500}>New Here?</Text>
                    </Flex>
                    <Flex align="center" flexDirection='column' width="38%">
                        <Text fontSize="10pt" color='#c6c6c6'>Navigate to the <Link textDecoration="underline" onClick={() => window.location = "/auth2"}>Sign Up</Link> page and create a new account. Once you are logged in, go to the "Generate Realizations" page to submit and monitor active realization jobs.</Text>
                    </Flex>
                    <Flex flexDirection='column' width="38%" ml={10}>
                        <Link onClick={() => window.location = "/methodology"} color="white">
                            <Text fontSize="11pt" fontWeight={700} color="#0E61FE">Read more about the methodology →</Text>
                        </Link>
                        <Link onClick={() => window.location = "https://gatorglaciology.github.io/gstatsimbook/intro.html"} color="white">
                            <Text fontSize="11pt" mt={2} fontWeight={700} color="#0E61FE">Learn about GStat-Sim →</Text>
                        </Link>
                    </Flex>
                </Flex>
            </Flex>
        </Hide>
    )
}
export default CounterCard;