import React, { useEffect, useState } from 'react';
import { Text, Tabs, TabList, Tab, TabPanel, TabPanels, Stack, Flex, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Tfoot, Button, useDisclosure, Progress } from '@chakra-ui/react'
import { MdRefresh } from 'react-icons/md';
import { FaRegClock } from 'react-icons/fa'
import CancelModal from '../Modals/CancelModal';

import { getBatchRequestsFromGUID } from '../../utils/utils';

// TODO DELETE
const testRequestData = [
    {rid: 1, guid: "a7a7a7a7a7a7", status: "loading"},
    {rid: 2, guid: "a7a7a7a7a7a7", status: "loading"},
    {rid: 3, guid: "a7a7a7a7a7a7", status: "success"},
    {rid: 4, guid: "a7a7a7a7a7a7", status: "error"},
    {rid: 5, guid: "a7a7a7a7a7a7", status: "error"}
]

const RequestsCard = ({
    requestGUID
}) => {
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [userCSRF, setUserCSRF] = useState();

    const { isOpen, onOpen, onClose } = useDisclosure()

    const IndicatorIcon = (type) => {
        const typeColor = {
            "success":"green.300",
            "loading":"orange.300",
            "error":"red.400"
        }
        return (
            <Flex align="center" gap="1.5">
                <Flex h={3} w={3} bg={typeColor[type]} borderRadius={4}></Flex>
                <Text letterSpacing="-0.5px" fontWeight={700} color={typeColor[type]}>{type.toUpperCase()}</Text>
            </Flex>
        )
    }

    const [timer, setTimer] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        try {
            setInterval(async () => {
                // const res = getBatchRequestsFromGUID(requestGUID, userCSRF);
                console.log("REQUEST RESPONSE: ", res)
            }, 60000)
        } catch (e) {
            console.log(e);
        }
    }, []);

    return (
        <Flex p="30px" w="100%" h="100%" flexDir="column">
            <CancelModal isOpen={isOpen} onClose={onClose}  />
            <Text fontWeight={600} fontSize="18pt" mb={2} >Request Overview</Text>
            <Tabs>
                <TabList>
                    <Tab _selected={{ color: '#0560FF', borderColor: '#0560FF'}}>Requests</Tab>
                    <Tab _selected={{ color: '#0560FF', borderColor: '#0560FF'}}>Completed</Tab>
                    <Tab ml="auto" _selected={{ color: '#0560FF', borderColor: '#0560FF'}}>History</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel px={0}>
                    <Flex mt={4} align="center">
                        <Flex w="50%" h="10px" align="center">
                                <Progress mt={1} size="md" w="100%" colorScheme="messenger" hasStripe value={20} />
                        </Flex>
                        <Flex w="50%" align="center">
                            <Flex ml={3} align="center" py={1.5} mb={-1} gap="1">
                                
                                <FaRegClock fontSize="10pt" color="#4A5567" />
                                <Text color="gray.600" fontWeight={600} fosntSize="11pt">Elapsed Time: </Text>
                                <Text fontSize="11pt" color="gray.600" fontWeight={600}>{timer}s</Text>
                            </Flex>
                            <Button borderRadius={0} isLoading={refreshLoading} onClick={() => {}} align='center' _hover={{cursor: 'pointer', opacity: '0.84'}} ml="auto" px={3} py={1.5} bg="#0E61FE" h="34px">
                                <Flex align='center' gap='1'>
                                    <MdRefresh color='white' />
                                    <Text color='white' fontWeight={500} fontSize="11pt">Refresh Status</Text>
                                </Flex>
                            </Button>
                            <Flex onClick={() => onOpen()} align='center' _hover={{cursor: 'pointer', opacity: '0.9'}} ml={4} px={3} py={1.5} bg="red.500">
                                <Text color="white" fontSize="11pt">Cancel All</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <TableContainer mt={5}>
                        <Table size='sm'>
                            <Thead>
                            <Tr bg="#f4f4f4">
                                <Th borderColor="lightgrey" borderBottomWidth="2px" py={2.5} letterSpacing="-0.5px" fontSize="11pt">RID</Th>
                                <Th borderColor="lightgrey" borderBottomWidth="2px" letterSpacing="-0.5px" fontSize="11pt" width="50%">GUID</Th>
                                <Th borderColor="lightgrey" borderBottomWidth="2px" letterSpacing="-0.5px" fontSize="11pt"><Flex><Text>STATUS</Text><Text ml='auto'>ACTION</Text></Flex></Th>
                            </Tr>
                            </Thead>
                            <Tbody>
                                {testRequestData.map((simRequest) => {
                                    return (
                                        <Tr>
                                            <Td borderBottomWidth="1.5px" fontWeight={700}>{simRequest.rid}</Td>
                                            <Td borderBottomWidth="1.5px" fontWeight={700}>{simRequest.guid}</Td>
                                            <Td borderBottomWidth="1.5px">
                                                <Flex>
                                                    {IndicatorIcon(simRequest.status)}
                                                    <Flex _hover={{cursor: 'pointer', opacity: '0.78'}} ml="auto" bg="#f4f4f4" px={1.5} py={1} borderRadius={5}>
                                                        <Text fontWeight={600}>Cancel</Text>
                                                    </Flex>
                                                </Flex>
                                            </Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    </TabPanel>
                    <TabPanel px={0}>
                        {/* <Text fontWeight={600} fontSize="16pt" mt={10}>Completed</Text>
                        <Flex mt={1} w="100%" h="1.5px" bg="black"></Flex> */}
                        <TableContainer mt={5}>
                            <Table size='sm'>
                                <Thead>
                                <Tr bg="#f4f4f4">
                                    <Th borderColor="lightgrey" borderBottomWidth="2px" py={2.5} letterSpacing="-0.5px" fontSize="11pt">RID</Th>
                                    <Th borderColor="lightgrey" borderBottomWidth="2px" letterSpacing="-0.5px" fontSize="11pt" width="50%">GUID</Th>
                                    <Th borderColor="lightgrey" borderBottomWidth="2px" letterSpacing="-0.5px" fontSize="11pt"><Flex><Text>ACTIONS</Text><Text ml='auto'></Text></Flex></Th>
                                </Tr>
                                </Thead>
                                <Tbody>
                                    {testRequestData.map((simRequest) => {
                                        return (
                                            <Tr>
                                                <Td borderBottomWidth="1.5px" fontWeight={700}>{simRequest.rid}</Td>
                                                <Td borderBottomWidth="1.5px" fontWeight={700}>{simRequest.guid}</Td>
                                                <Td borderBottomWidth="1.5px">
                                                    <Flex>
                                                        <Flex _hover={{cursor: 'pointer', opacity: '0.78'}} bg="whatsapp.300" px={1.5} py={1} borderRadius={5}>
                                                            <Text fontWeight={600}>View</Text>
                                                        </Flex>
                                                        <Flex ml={4} _hover={{cursor: 'pointer', opacity: '0.78'}} bg="twitter.300" px={1.5} py={1} borderRadius={5}>
                                                            <Text fontWeight={600}>Copy</Text>
                                                        </Flex>
                                                        <Flex _hover={{cursor: 'pointer', opacity: '0.78'}} ml="auto" bg="#f4f4f4" px={1.5} py={1} borderRadius={5}>
                                                            <Text fontWeight={600}>Download CSV</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Td>
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel px={0}>
                        <Flex gap="2">
                            <Flex border="1.5px solid #D3D3D3" flexDirection="column" bg="#F4F4F4" p={4} w="-webkit-fit-content">
                                {/* <Text fontSize="11pt" pt={5}>Generating 300 realizations with the following inputs:</Text> */}
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Resolution:&nbsp;</Text>
                                    <Text fontSize="11pt">40</Text>
                                </Flex>
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Max X:&nbsp;</Text>
                                    <Text fontSize="11pt">40</Text>
                                </Flex>
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Max Y:&nbsp;</Text>
                                    <Text fontSize="11pt">40</Text>
                                </Flex>
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Min X:&nbsp;</Text>
                                    <Text fontSize="11pt">40</Text>
                                </Flex>
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Min Y:&nbsp;</Text>
                                    <Text fontSize="11pt">40</Text>
                                </Flex>
                            </Flex>

                            <Flex border="1.5px solid #D3D3D3" flexDirection="column" bg="#F4F4F4" p={4} w="-webkit-fit-content">
                                {/* <Text fontSize="11pt" pt={5}>Generating 300 realizations with the following inputs:</Text> */}
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Resolution:&nbsp;</Text>
                                    <Text fontSize="11pt">40</Text>
                                </Flex>
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Max X:&nbsp;</Text>
                                    <Text fontSize="11pt">40</Text>
                                </Flex>
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Max Y:&nbsp;</Text>
                                    <Text fontSize="11pt">40</Text>
                                </Flex>
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Min X:&nbsp;</Text>
                                    <Text fontSize="11pt">40</Text>
                                </Flex>
                                <Flex>
                                    <Text fontSize="11pt" fontWeight={600}>Min Y:&nbsp;</Text>
                                    <Text fontSize="11pt">40</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            
        </Flex>
    )
}
export default RequestsCard;