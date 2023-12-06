import React, { useState } from "react";
import { Button, Modal, Text, ModalOverlay, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { cancelBatchRequestFromGUID } from "../../utils/utils";

const CancelModal = ({
  isOpen, 
  onClose, 
  requestGUID, 
  csrf
}) => {
    const [loading, setLoading] = useState(false);

    const cancelAllRequests = async () => {
      setLoading(true);
      try {
          const res = await cancelBatchRequestFromGUID(requestGUID, csrf);
          console.log("Result cancel all:", res);
      } catch (error) {
          console.log("Cancel All Error: ", error);
      }
      setLoading(false);
      onClose();
    }  

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent borderRadius={0} w="300px">
            <ModalBody mt={6}>
                <Text textAlign="center" fontWeight={600}>Are you sure you want to cancel all processes?</Text>
                
            </ModalBody>
            <ModalFooter justifyContent="center" mt={-2} mb={4}>
              <Button onClickCapture={() => cancelAllRequests()} isLoading={loading} colorScheme='blue' mr={3} onClick={onClose} borderRadius={0}>
                Confirm
              </Button>
              <Button colorScheme='gray' onClick={onClose} borderRadius={0}>Exit</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    )
  }
export default CancelModal;