import React from 'react';
import { Flex, Stack, Text } from "@chakra-ui/react";

const HistoryTab = ({
    requestHistory,
}) => {
    return (
        <Flex gap="2" flexWrap="wrap">
            {!requestHistory || (requestHistory && requestHistory.length === 0) && (
                <Stack mt={2} gap={2.5}>
                    <Text>Realization requests you've already submitted will appear here.</Text>
                    <Text mt={4}>Currently, you have none.</Text>
                </Stack>
            )}
            {requestHistory && requestHistory.map((req, i) => {
                return (
                    <Flex key={i} border="1.5px solid #D3D3D3" flexDirection="column" bg="#fafafa" p={4} w="-webkit-fit-content">
                        
                        <Flex flexDirection="column">
                            
                            <Flex gap="2">
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Max X:&nbsp;</Text>
                                    <Text fontSize="11pt">{req.maxx}</Text>
                                </Flex>
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Max Y:&nbsp;</Text>
                                    <Text fontSize="11pt">{req.maxy}</Text>
                                </Flex>
                            </Flex>
                            <Flex gap="2">
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Min X:&nbsp;</Text>
                                    <Text fontSize="11pt">{req.minx}</Text>
                                </Flex>
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Min Y:&nbsp;</Text>
                                    <Text fontSize="11pt">{req.miny}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex w="-webkit-fit-content">
                            <Text fontSize="11pt" fontWeight={600}>Resolution:&nbsp;</Text>
                            <Text fontSize="11pt">{req.cellSize}</Text>
                        </Flex>
                        <Flex w="-webkit-fit-content">
                            <Text fontSize="11pt" fontWeight={600}>Realizations:&nbsp;</Text>
                            <Text fontSize="11pt">{req.realizations}</Text>
                        </Flex>
                        <Flex w="-webkit-fit-content">
                            <Text fontSize="11pt" fontWeight={600}>Timestamp:&nbsp;</Text>
                            <Text fontSize="11pt">{req.date.slice(0,-8)}</Text>
                        </Flex>
                        <Flex w="-webkit-fit-content">
                            <Text fontSize="11pt" fontWeight={600}>GUID:&nbsp;</Text>
                            {/* <Text _hover={{textDecoration: 'underline', cursor: 'pointer'}} fontSize="11pt" fontWeight={500} color="#065FFF">{req.guid.slice(0,-10)}...</Text> */}
                            <Text _hover={{textDecoration: 'underline', cursor: 'pointer'}} fontSize="11pt" fontWeight={500} color="#065FFF">{req.guid}...</Text>
                        
                        </Flex>
                        
                        
                    </Flex>
                )
            })}
        </Flex>          
    )
}
export default HistoryTab;