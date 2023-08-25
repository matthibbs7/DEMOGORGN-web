import React from 'react';
import { Text, Flex } from '@chakra-ui/react'
import MethodCard from '../Cards/MethodCard';

const MethodologyPage = (props) => {
    return (
        <>
            <Flex justifyContent='center' flexDirection="column">
                <Flex ml="auto" mr="auto" width="100%" maxWidth="1050px" bgColor="#F1F4F8" mb={5}>
                    <Flex justifyContent='center' mt={5} flexDirection='column'>
                        <MethodCard />
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}
export default MethodologyPage;