import React, { useEffect, useState } from 'react';
import { Text, Tabs, TabList, Image, Tab, TabPanel, TabPanels, Stack, Flex, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Tfoot, Button, useDisclosure, Progress, Spinner, Select } from '@chakra-ui/react'
import { MdRefresh } from 'react-icons/md';
import { FaRegClock, FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { AiOutlineRollback } from 'react-icons/ai'
import CancelModal from '../Modals/CancelModal';


import { getBatchRequestsFromGUID, getRealizationImage, getUserSimulations } from '../../utils/utils';
import CompletedTableRow from '../Table/CompletedTableRow';

// TODO DELETE
const testRequestData = [
    {rid: 1, guid: "a7a7a7a7a7a7", status: "loading"},
    {rid: 2, guid: "a7a7a7a7a7a7", status: "loading"},
    {rid: 3, guid: "a7a7a7a7a7a7", status: "success"},
    {rid: 4, guid: "a7a7a7a7a7a7", status: "error"},
    {rid: 5, guid: "a7a7a7a7a7a7", status: "error"}
]

const testGUID = "3d3c7c35-9d07-467f-8dff-0fc576dd6913";

const testCompletedData = [
    {rid: 1, guid: testGUID},
    {rid: 2, guid: testGUID},
    {rid: 3, guid: testGUID},
    {rid: 4, guid: testGUID},
    {rid: 5, guid: testGUID},
    {rid: 6, guid: testGUID},
    {rid: 7, guid: testGUID},
    {rid: 8, guid: testGUID},
    {rid: 9, guid: testGUID},
    {rid: 10, guid: testGUID},
    {rid: 11, guid: testGUID},
    {rid: 12, guid: testGUID},
    {rid: 13, guid: testGUID},
    {rid: 14, guid: testGUID},
    {rid: 15, guid: testGUID},
    {rid: 16, guid: testGUID},
    {rid: 17, guid: testGUID},
    {rid: 18, guid: "ca2eb848-58cc-4b40-8ab8-8ee82912f616"},
    {rid: 19, guid: "ca2eb848-58cc-4b40-8ab8-8ee82912f616"},
    {rid: 20, guid: "ca2eb848-58cc-4b40-8ab8-8ee82912f616"},
    {rid: 21, guid: "ca2eb848-58cc-4b40-8ab8-8ee82912f616"},
    {rid: 22, guid: "ca2eb848-58cc-4b40-8ab8-8ee82912f616"},
    {rid: 23, guid: "ca2eb848-58cc-4b40-8ab8-8ee82912f616"},
    {rid: 24, guid: "ca2eb848-58cc-4b40-8ab8-8ee82912f616"},
    {rid: 25, guid: "ca2eb848-58cc-4b40-8ab8-8ee82912f616"},
    {rid: 26, guid: "ca2eb848-58cc-4b40-8ab8-8ee82912f616"},
    {rid: 27, guid: "ca2eb848-58cc-4b40-8ab8-8ee82912f616"},
    {rid: 28, guid: "ca2eb848-58cc-4b40-8ab8-8ee82912f616"},
    {rid: 29, guid: "ca2eb848-58cc-4b40-8ab8-8ee82912f616"},
]


const ArchivedRequestCard = ({
    requestGUID,
    requestData,
}) => {
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [requestHistory, setRequestHistory] = useState([]);
    const [historyCount, setHistoryCount] = useState(0);
    const [userCSRF, setUserCSRF] = useState();
    // TODO remove -> redirect to new page/modal with image
    const [previewImageSrc, setPreviewImageSrc] = useState("");
    
    // create obj on client to store image srcs so we don't have to call api again (semi-cache)
    const [savedPreviewImages, setSavedPreviewImages] = useState({});
    const [currentPreviewRID, setCurrentPreviewRID] = useState();

    const { isOpen, onOpen, onClose } = useDisclosure()

    // pagination controls
    const [resultsPerPage, setResultsPerPage] = useState(5);
    const [paginatedData, setPaginatedData] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);

    // get sim status data then paginate to 5 results by default
    useEffect(() => {
        const tempData = [...testCompletedData].slice(0, resultsPerPage);
        setPaginatedData(tempData);
    }, [])

    // update results per page on change
    useEffect(() => {
        const tempData = [...testCompletedData].slice((pageIndex - 1) * resultsPerPage, Number((pageIndex - 1) * resultsPerPage) + Number(resultsPerPage));
        setPaginatedData(tempData);
    }, [pageIndex])

    useEffect(() => {
        setPageIndex(1);
        const tempData = [...testCompletedData].slice(0, resultsPerPage);
        setPaginatedData(tempData);
    }, [resultsPerPage])

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
                // console.log("REQUEST RESPONSE: ", res)
            }, 60000)
        } catch (e) {
            console.log(e);
        }
    }, []);

    const getRequestHistory = async () => {
        try {
            const res = await getUserSimulations();
            console.log("reqhistory",res)
            setRequestHistory(res);
            setHistoryCount(res.length);
        } catch (e) {
            console.log("getRequestHistory Error: ", e);
        }
    }

    useEffect(() => {getRequestHistory()}, [])

    return (
        <Flex p="30px" w="100%" h="100%" flexDir="column">
            <CancelModal isOpen={isOpen} onClose={onClose}  />
            <Flex w="100%">
                <Flex px={4} py={2} bg="yellow.300" borderRadius={4}>
                    <Text color="blackAlpha.600" fontWeight={600}>Viewing Archived Request</Text>
                
                </Flex>
                <Flex align="center" ml="auto">
                    <Text color="#0560FF">Back to current request&nbsp;</Text>
                </Flex>
            </Flex>
            <Text fontWeight={600} fontSize="18pt" mb={2}>Request Overview</Text>
            {/* <Text>THIS IS CURRENT GUID: {requestGUID ?? ''}{requestData.minx}</Text> */}
            <Flex align="center">
                {previewImageSrc.length > 0 && (
                    <Flex flexDirection="column" maxW="300px" align="center" justifyContent="center">
                        <Text color="#1A202C" fontSize="11px" fontStyle="italic">Currently Viewing RID #{currentPreviewRID}</Text>
                        <Image maxW="300px" maxH="300px" src={previewImageSrc} />
                    </Flex>
                )}
                <Flex justifyContent="center" flexDirection="column" p={4} h="306.5px" w="400px">
                    <Flex flexDirection="column">
                        
                        <Flex px={1} borderRadius={4} w="-webkit-fit-content" gap="2" bg="#F4F4F4" border="1.5px solid #D3D3D3">
                            <Flex>
                                <Text fontSize="12pt" fontWeight={600}>Max X:&nbsp;</Text>
                                <Text fontSize="12pt">{requestData.maxx}</Text>
                            </Flex>
                            <Flex>
                                <Text fontSize="12pt" fontWeight={600}>Max Y:&nbsp;</Text>
                                <Text fontSize="12pt">{requestData.maxy}</Text>
                            </Flex>
                        </Flex>
                        <Flex mt={1.5} px={1} borderRadius={4} w="-webkit-fit-content" gap="2" bg="#F4F4F4" border="1.5px solid #D3D3D3">
                            <Flex>
                                <Text fontSize="12pt" fontWeight={600}>Min X:&nbsp;</Text>
                                <Text fontSize="12pt">{requestData.minx}</Text>
                            </Flex>
                            <Flex>
                                <Text fontSize="12pt" fontWeight={600}>Min Y:&nbsp;</Text>
                                <Text fontSize="12pt">{requestData.miny}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex mt={1.5} borderRadius={4} px={1} w="-webkit-fit-content" bg="#F4F4F4" border="1.5px solid #D3D3D3">
                        <Text fontSize="12pt" fontWeight={600}>Resolution:&nbsp;</Text>
                        <Text fontSize="12pt">{requestData.cellSize}</Text>
                    </Flex>
                    <Flex mt={1.5} borderRadius={4} px={1} w="-webkit-fit-content" bg="#F4F4F4" border="1.5px solid #D3D3D3">
                        <Text fontSize="12pt" fontWeight={600}>Realizations:&nbsp;</Text>
                        <Text fontSize="12pt">{requestData.realizations}</Text>
                    </Flex>
                    <Flex mt={1.5} borderRadius={4} px={1} w="-webkit-fit-content" bg="#F4F4F4" border="1.5px solid #D3D3D3">
                            <Text fontSize="12pt" fontWeight={600}>GUID:&nbsp;</Text>
                            <Text fontSize="12pt">{testGUID}</Text>
                    </Flex>
                </Flex>
                
            </Flex>
            <Tabs>
                <TabList>
                    <Tab _selected={{ color: '#0560FF', borderColor: '#0560FF'}}>Requests</Tab>
                    <Tab _selected={{ color: '#0560FF', borderColor: '#0560FF'}}>Completed</Tab>
                    <Tab disabled={!historyCount || historyCount === 0} ml="auto" _selected={{ color: '#0560FF', borderColor: '#0560FF'}}>History {historyCount !== 0 && `(${historyCount})`}</Tab>
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
                                <Text color="gray.600" fontWeight={600} fontSize="11pt">Elapsed Time: </Text>
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
                                {testRequestData.map((simRequest, i) => {
                                    return (
                                        <Tr key={i}>
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
                        <Flex mt={0} mb={-3} align="center">
                            <Flex onClick={() => setPageIndex(Math.max(1, pageIndex - 1))} _hover={{cursor: 'pointer', opacity: 0.7}} h="32px" w="32px" bg="#F4F4F4" p={2} align="center" justifyContent="center">
                                <FaAngleLeft fontSize="13.5pt" color="#4A5567" />
                            </Flex>
                            <Flex onClick={() => {resultsPerPage * pageIndex > testCompletedData.length ? null : setPageIndex(pageIndex + 1)}} _hover={{cursor: 'pointer', opacity: 0.7}} ml={3} h="32px" w="32px" bg="#F4F4F4" p={2} align="center" justifyContent="center">
                                <FaAngleRight fontSize="13.5pt" color="#4A5567" />
                            </Flex>
                            <Text ml={4} color="#4A5567" fontSize="10.5pt" fontStyle="italic">Realizations {((pageIndex - 1) * resultsPerPage + 1)} - {resultsPerPage * pageIndex > testCompletedData.length ? testCompletedData.length : resultsPerPage * pageIndex} of {testCompletedData.length}</Text>
                            <Text ml="auto" color="#4A5567" fontSize="10.5pt">Results per page</Text>
                            <Select onChange={(v) => setResultsPerPage(v.target.value)} value={resultsPerPage} focusBorderColor='#065FFF' fontSize="10.5pt" color="#4A5567" ml={2} w="54px" variant='flushed'>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={50}>50</option>
                            </Select>
                        </Flex>
                        <TableContainer mt={5}>
                            <Table border="2px solid #F4F4F4" size='sm'>
                                <Thead>
                                <Tr bg="#f4f4f4">
                                    <Th borderColor="lightgrey" borderBottomWidth="2px" py={2.5} letterSpacing="-0.5px" fontSize="11pt">RID</Th>
                                    <Th borderColor="lightgrey" borderBottomWidth="2px" letterSpacing="-0.5px" fontSize="11pt" width="50%">GUID</Th>
                                    <Th borderColor="lightgrey" borderBottomWidth="2px" letterSpacing="-0.5px" fontSize="11pt"><Flex><Text>ACTIONS</Text><Text ml='auto'></Text></Flex></Th>
                                </Tr>
                                </Thead>
                                <Tbody>
                                    {paginatedData.map((simRequest, i) => {
                                        return (
                                            <CompletedTableRow 
                                                key={i} 
                                                simRequest={simRequest} 
                                                setPreviewImageSrc={setPreviewImageSrc} 
                                                savedPreviewImages={savedPreviewImages} 
                                                setSavedPreviewImages={setSavedPreviewImages} 
                                                currentPreviewRID={currentPreviewRID}
                                                setCurrentPreviewRID={setCurrentPreviewRID}
                                            />
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        
                    </TabPanel>
                    <TabPanel px={0}>
                        <Flex gap="2">
                            {!requestHistory || (requestHistory && historyCount === 0) && (
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
                                            <Text _hover={{textDecoration: 'underline', cursor: 'pointer'}} fontSize="11pt" fontWeight={500} color="#065FFF">{req.guid.slice(0,-10)}...</Text>
                                        </Flex>
                                        
                                        
                                    </Flex>
                                )
                            })}
                            

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
export default ArchivedRequestCard;