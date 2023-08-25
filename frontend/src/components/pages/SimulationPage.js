import React from 'react';
// import CounterCard from '../components/Cards/CounterCard';
import SimulateCard from '../Cards/SimulateCard';
import { Text, Flex } from '@chakra-ui/react';

const SimulationPage = (props) => {
    return (
        <Flex justifyContent='center' >
            <Flex width="100%" maxWidth="1050px" bgColor="#F1F4F8" flexDirection="column">
                <Flex justifyContent='center' mt={5} flexDirection='column'>
                <SimulateCard />
                {/* <CounterCard /> */}
                </Flex>
            </Flex>
        </Flex>
    )
}
export default SimulationPage;