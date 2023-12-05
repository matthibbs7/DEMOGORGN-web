import React from 'react';
import SimulateCard from '../Cards/SimulateCard';
import { Flex } from '@chakra-ui/react';

const SimulationPage = ({
    csrf,
    isAuthenticated,
}) => {
    return (
        <Flex justifyContent='center' >
            <Flex width="100%" maxWidth="1050px" bgColor="#F1F4F8" flexDirection="column">
                <Flex justifyContent='center' mt={[0,0,5,5]} flexDirection='column'>
                    <SimulateCard csrf={csrf} isAuthenticated={isAuthenticated} />
                </Flex>
            </Flex>
        </Flex>
    )
}
export default SimulationPage;