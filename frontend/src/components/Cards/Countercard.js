import React from 'react';
import { Text, Flex, Image, Link, Hide } from '@chakra-ui/react'
const CounterCard = () => {
    
    return (
        <Hide below="md">
            <Flex flexDirection='row' bgColor='#161616' height="130px" p={5} mt={5}>
                <Flex width="25%" minWidth="300px" alignContent='center' flexDirection='column' borderRight="1px solid grey" >
                    <Flex ml={3}>
                        <Text ml="auto" bgGradient='linear(to-l, rgba(79,120,247,1), rgba(130,173,240,1))' bgClip='text' fontSize="26pt" fontWeight={700}>1</Text>
                        <Image mr={10} src="https://i.imgur.com/mCsPNvO.png" height="46px" maxWidth="46px" ml={2} mt={2} />
                    </Flex>
                    <Flex ml={3}>
                        <Text color="white" fontWeight={500} fontSize="15pt" mt={0}>Realizations Generated </Text>
                        
                    </Flex>
                    
                </Flex>
                <Flex width="75%" flexDirection='row'>
                    <Flex flexDirection='column' width="24%">
                        <Text ml={5} color='white' fontWeight={500}>Methodology</Text>
                    </Flex>
                    <Flex flexDirection='column' width="38%">
                        <Text fontSize="10pt" color='#c6c6c6'>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make </Text>
                    </Flex>
                    <Flex flexDirection='column' width="38%" ml={10}>
                        <Link color="white">
                            <Text fontSize="11pt" fontWeight={700} color="#0E61FE">Read more about the methodology →</Text>
                        </Link>
                        <Link color="white">
                            <Text fontSize="11pt" mt={2} fontWeight={700} color="#0E61FE">Learn about GStat-Sim →</Text>
                        </Link>
                    </Flex>
                </Flex>
            </Flex>
        </Hide>
    )
}
export default CounterCard;