import React, { useState, useEffect } from 'react';
import { Flex, Progress, Text, Button, TableContainer, Table, Thead, Tbody, Tr, Td, Th, Spinner } from "@chakra-ui/react";
import { FaRegClock, FaCheck } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import { TbInfoSquare } from 'react-icons/tb';

import RequestsTableRow from '../Table/RequestsTableRow';

const RequestsTab = ({
    rawBatchData,
    completedRequests,
    refreshLoading,
    requestLoading,
    setTabIndex,
    getBatchRealizationStatus,
    onOpen,
    csrf,
}) => {
    return (
        <>
            <Flex mt={4} align="center">
                
                <Flex w="50%" gap={4} h="10px" align="center">
                    {requestLoading ? (
                        <Spinner mt={1} w="12px" h="12px" />
                    ) : (
                        <Text fontWeight={600}><FaCheck /></Text>
                    )}
                    <Progress 
                        mt={1} 
                        size="md" 
                        w="100%" 
                        colorScheme="messenger" 
                        hasStripe 
                        value={completedRequests.length / rawBatchData.length * 100} 
                    />
                </Flex>
                <Flex w="50%" align="center">
                    <Button isDisabled={rawBatchData.filter((r) => r.status === "PENDING" || r.status === "RUNNING").length === 0} borderRadius={0} isLoading={refreshLoading} onClick={() => getBatchRealizationStatus()} align='center' _hover={{cursor: rawBatchData.filter((r) => r.status === "PENDING" || r.status === "RUNNING").length === 0 ? 'no-drop' : 'pointer', opacity: rawBatchData.filter((r) => r.status === "PENDING" || r.status === "RUNNING").length === 0 ? null : '0.84'}} ml="auto" px={3} py={1.5} bg="#0E61FE" h="34px">
                        <Flex align='center' gap='1'>
                            <MdRefresh color='white' />
                            <Text color='white' fontWeight={500} fontSize="11pt">Refresh Status</Text>
                        </Flex>
                    </Button>
                    <Button isDisabled={rawBatchData.filter((r) => r.status === "PENDING" || r.status === "RUNNING").length === 0} borderRadius={0} onClick={() => onOpen()} align='center' _hover={{cursor: rawBatchData.filter((r) => r.status === "PENDING" || r.status === "RUNNING").length === 0 ? 'no-drop' : 'pointer', opacity: rawBatchData.filter((r) => r.status === "PENDING" || r.status === "RUNNING").length === 0 ? null : '0.84'}} ml={4} px={3} py={1.5} bg="red.500" h="34px">
                        <Flex align='center'>
                            <Text color="white" fontSize="11pt">Cancel All</Text>
                        </Flex>
                    </Button>
                </Flex>
            </Flex>
            <TableContainer mt={5}>
                <Table size='sm'>
                    <Thead>
                    <Tr bg="#f4f4f4">
                        <Th borderColor="lightgrey" borderBottomWidth="2px" py={2.5} letterSpacing="-0.5px" fontSize="11pt">RID</Th>
                        <Th borderColor="lightgrey" borderBottomWidth="2px" letterSpacing="-0.5px" fontSize="11pt" width="50%">GUID</Th>
                        <Th borderColor="lightgrey" borderBottomWidth="2px" letterSpacing="-0.5px" fontSize="11pt"><Flex align="center"><TbInfoSquare style={{marginTop: "1.25px", marginRight: "4px", fontSize: "18px", marginLeft: "-3px"}} /><Text>STATUS</Text><Text ml='auto'>ACTION</Text></Flex></Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {rawBatchData.map((simRequest, i) => {
                            return (
                                <RequestsTableRow
                                    key={i} 
                                    simRequest={simRequest}
                                    setTabIndex={setTabIndex}
                                    getBatchRealizationStatus={getBatchRealizationStatus}
                                    csrf={csrf}
                                />
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </>             
    )
}
export default RequestsTab;