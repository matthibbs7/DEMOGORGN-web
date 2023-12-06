import React from 'react';
import { Flex } from '@chakra-ui/react';

import HistoryCard from '../Cards/HistoryCard';

const HistoryPage = ({
    csrf,
    isAuthenticated,
}) => {
    return (
        <Flex justifyContent='center' >
            <Flex width="100%" maxWidth="1050px" bgColor="#F1F4F8" flexDirection="column">
                <Flex justifyContent='center' mt={[0,0,5,5]} flexDirection='column'>
                    <HistoryCard 
                        csrf={csrf} 
                        isAuthenticated={isAuthenticated}
                    />
                </Flex>
            </Flex>
        </Flex>
    )
}
export default HistoryPage;