import React from "react";
import { Button, Modal, Flex, Text, ModalOverlay, ModalCloseButton, ModalBody, ModalContent, ModalFooter, ModalHeader, Lorem } from "@chakra-ui/react";
import { IoWarning } from "react-icons/io5"

const CancelModal = ({isOpen, onClose}) => {
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent borderRadius={0} w="300px">
            {/* <ModalHeader textAlign="center" mb={-3}>Are you sure you want to kill all processes</ModalHeader> */}
            <ModalBody mt={6}>
                <Text textAlign="center" fontWeight={600}>Are you sure you want to cancel all processes?</Text>
                
            </ModalBody>
            <ModalFooter justifyContent="center" mt={-2}>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost'>Confirm</Button>
            </ModalFooter>
            
                <Text mt={-1.5} mb={5} textAlign="center" fontWeight={700} color="gray.600" fontSize="10pt">(This process cannot be undone.)</Text>
          </ModalContent>
        </Modal>
    )
  }
export default CancelModal;