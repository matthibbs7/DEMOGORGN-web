import React, { useState } from 'react';
import { Tr, Td, Flex, Text, Spinner } from "@chakra-ui/react";
import { getRealizationImage } from '../../utils/utils';

// TODO CHANGE TO SIMREQUEST.GUID
const testGUID = "ca2eb848-58cc-4b40-8ab8-8ee82912f616";

const CompletedTableRow = ({
    simRequest,
    setPreviewImageSrc,
    savedPreviewImages,
    setSavedPreviewImages,
    currentPreviewRID,
    setCurrentPreviewRID,
}) => {
    const [loading, setLoading] = useState(false);

    const getRealizationBase64Image = async (rid) => {
        // if image src is already in our stored image src obj,
        // then we've already called the api and can load existing source
        
        if (savedPreviewImages[rid]) {
            setPreviewImageSrc(savedPreviewImages[rid]);
            setCurrentPreviewRID(rid);
            return
        }

        setLoading(true)
        try {
            const imageSrc = await getRealizationImage(testGUID, rid);
            const decryptedSrc = "data:image/png;base64," + imageSrc.base64_image
            setPreviewImageSrc(decryptedSrc);
            setCurrentPreviewRID(rid);
            setSavedPreviewImages(savedPreviewImages => ({...savedPreviewImages, [rid]: decryptedSrc}))
            setLoading(false)
        } catch (e) {
            console.log("getImage error: ", e);
            setLoading(false)
        }
    }

    return (
        <Tr>
            <Td borderBottomWidth="1.5px" fontWeight={700}>{simRequest.rid}</Td>
            <Td borderBottomWidth="1.5px" fontWeight={700}>
                <Flex align="center">
                    {testGUID}
                    {currentPreviewRID === simRequest.rid && (
                        <Flex ml="auto" align="center" justifyContent="center" px={1.5} py={1} borderRadius={5} bg="#F4F4F4">
                            <Text color="#a1a1a1">VIEWING</Text>
                        </Flex>
                    )}
                </Flex>
            </Td>
            <Td borderBottomWidth="1.5px">
                <Flex>
                    <Flex onClick={() => getRealizationBase64Image(simRequest.rid)} _hover={{cursor: 'pointer', opacity: '0.78'}} bg="whatsapp.300" px={1.5} py={1} borderRadius={5} w="45px" align="center" justifyContent="center">
                        {loading ? (
                            <Spinner w="10px" h="10px" />
                        ) : (
                            <Text fontWeight={600}>View</Text>
                        )}
                        
                    </Flex>
                    <Flex ml={4} _hover={{cursor: 'pointer', opacity: '0.78'}} bg="twitter.300" px={1.5} py={1} borderRadius={5}>
                        <Text fontWeight={600}>Copy</Text>
                    </Flex>
                    <Flex onClick={() => window.open(`/api/simulation-csv/${testGUID}/${simRequest.rid}`, "_blank")} _hover={{cursor: 'pointer', opacity: '0.78'}} ml="auto" bg="#f4f4f4" px={1.5} py={1} borderRadius={5}>
                        <Text fontWeight={600}>Download CSV</Text>
                    </Flex>
                </Flex>
            </Td>
        </Tr>
    )
}
export default CompletedTableRow;