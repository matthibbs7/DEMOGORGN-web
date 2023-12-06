import React, { useEffect, useState } from 'react';
import { Text, Image, Flex, TableContainer, Table, Thead, Tr, Th, Td, Tbody, useDisclosure, Spinner, Select } from '@chakra-ui/react'
import { FaAngleLeft, FaAngleRight, FaRegShareSquare } from 'react-icons/fa'
import CancelModal from '../Modals/CancelModal';

import { getBatchRequestsFromGUID, getLookupRequestFromGUID, getRealizationImage, timeSince, sleep } from '../../utils/utils';
import CompletedTableRow from '../Table/CompletedTableRow';

const ViewRequestCard = ({
    requestGUID,
    rid,
    csrf
}) => {
    const [initialLoading, setInitialLoading] = useState(true);
    const [requestData, setRequestData] = useState([]);
    const [completedData, setCompletedData] = useState([]);
    const [completedRequestCount, setCompletedRequestCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

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
    const getRequestData = async () => {
        const res = await getLookupRequestFromGUID(requestGUID, csrf);
        setRequestData(res);
    }

    const getCompletedData = async () => {
        const res = await getBatchRequestsFromGUID(requestGUID, csrf);
        const tempData = [...res.statuses].filter((r) => r.status === "COMPLETE");
        setCompletedData(tempData)
        setCompletedRequestCount(tempData.length);
        const splicedData = [...tempData].slice(0, resultsPerPage);
        setPaginatedData(splicedData);
        setInitialLoading(false);
    }

    // if optional RID is included in the current URL (request/guid[/rid]) -> fetch and set as default image viewing
    const getDefaultPreviewImage = async () => {
        if (!rid) {
            return
        }
        setLoading(true)
        const imageSrc = await getRealizationImage(requestGUID, rid - 1);
        const decryptedSrc = "data:image/png;base64," + imageSrc.base64_image
        setPreviewImageSrc(decryptedSrc);
        setCurrentPreviewRID(rid - 1);
        setSavedPreviewImages(savedPreviewImages => ({...savedPreviewImages, [rid - 1]: decryptedSrc}))
        setLoading(false)
    }

    const getTimeSince = (timestamp) => {
        var localDate = new Date(timestamp)
        try {
            return timeSince(localDate)
        } catch (error) {
            console.log("timeSince Error: ", error)
        }     
    }

    const getShareLink = async () => {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        await sleep(1600);
        setIsCopied(false);
    }
    
    useEffect(() => {
       getRequestData();
       getCompletedData();
       getDefaultPreviewImage();
    }, [])

    // update results per page on change
    useEffect(() => {
        const tempData = [...completedData].slice((pageIndex - 1) * resultsPerPage, Number((pageIndex - 1) * resultsPerPage) + Number(resultsPerPage));
        setPaginatedData(tempData);
    }, [pageIndex])

    useEffect(() => {
        setPageIndex(1);
        const tempData = [...completedData].slice(0, resultsPerPage);
        setPaginatedData(tempData);
    }, [resultsPerPage])

    return (
        <Flex bg="white" border="1px solid black" mb={10} flexDirection={['column', 'column', 'row', 'row']} flexWrap='wrap'>
            <Flex p="30px" w="100%" h="100%" flexDir="column">
                <CancelModal isOpen={isOpen} onClose={onClose}  />
                <Flex align="center">
                    <Text fontWeight={600} fontSize="18pt" mb={2}>Request Overview</Text>
                    <Flex bg="#fff" border="1px solid #d3d3d3" borderRadius={2} gap="1" ml="auto" px={2} align="center" justifyContent="center" h="32px">
                        <Text color="#222" fontStyle="italic" fontWeight={500} fontSize="14px">Submitted {getTimeSince(requestData.date)} ago</Text>
                    </Flex>
                    <Flex onClick={() => getShareLink()} _hover={{opacity: "0.9", cursor: "pointer"}} bg="cornflowerblue" gap="1" ml="4" px={2} align="center" justifyContent="center" borderRadius={2} h="32px">
                        <FaRegShareSquare color="white" />
                        <Text color="white" fontWeight={500} fontSize="14px">{isCopied ? 'Copied' : 'Share'}</Text>
                    </Flex>
                </Flex>
                <Flex align="center">
                    {previewImageSrc.length > 0 && (
                        <Flex flexDirection="column" maxW="300px" align="center" justifyContent="center">
                            <Text color="#1A202C" fontSize="11px" fontStyle="italic">Currently Viewing RID #{(Number(currentPreviewRID) + 1).toString()}</Text>
                            {loading ? (<Spinner h="30px" w="30px" />) : (<Image maxW="300px" maxH="300px" src={previewImageSrc} />)}
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
                                <Text fontSize="12pt">{requestGUID}</Text>
                        </Flex>
                    </Flex>
                    
                </Flex>
                {initialLoading && <Spinner />}
                {paginatedData && paginatedData.length > 0 && (
                    <Flex mt={0} mb={-3} align="center">
                        <Flex onClick={() => setPageIndex(Math.max(1, pageIndex - 1))} _hover={{cursor: 'pointer', opacity: 0.7}} h="32px" w="32px" bg="#F4F4F4" p={2} align="center" justifyContent="center">
                            <FaAngleLeft fontSize="13.5pt" color="#4A5567" />
                        </Flex>
                        <Flex onClick={() => {resultsPerPage * pageIndex > completedRequestCount ? null : setPageIndex(pageIndex + 1)}} _hover={{cursor: 'pointer', opacity: 0.7}} ml={3} h="32px" w="32px" bg="#F4F4F4" p={2} align="center" justifyContent="center">
                            <FaAngleRight fontSize="13.5pt" color="#4A5567" />
                        </Flex>
                        <Text ml={4} color="#4A5567" fontSize="10.5pt" fontStyle="italic">Realizations {((pageIndex - 1) * resultsPerPage + 1)} - {resultsPerPage * pageIndex > completedRequestCount ? completedRequestCount : resultsPerPage * pageIndex} of {completedRequestCount} completed</Text>
                        <Text ml="auto" color="#4A5567" fontSize="10.5pt">Results per page</Text>
                        <Select onChange={(v) => setResultsPerPage(v.target.value)} value={resultsPerPage} focusBorderColor='#065FFF' fontSize="10.5pt" color="#4A5567" ml={2} w="54px" variant='flushed'>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={50}>50</option>
                        </Select>
                    </Flex>
                )}
                {paginatedData && paginatedData.length > 0 ? (
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
                ) : (!initialLoading && (
                    <Flex ml={4} w="-webkit-fit-content" bg="red.300" p={3} borderRadius={4}>
                        <Text color="black" fontWeight={400}>No completed realizations found. (Realizations may still be pending)</Text>
                    </Flex>
                ))}  
            </Flex>
        </Flex>
    )
}
export default ViewRequestCard;