import React, { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, } from '@chakra-ui/react'
import { Button, Input} from '@chakra-ui/react'
import { AddIcon, MinusIcon, } from '@chakra-ui/icons'

const ModalView = (props) => {
  const [money, setMoney] = useState(0)
  return (
    <>
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay bg='rgba(0, 0, 0, 0.8)' />
            <ModalContent>
            <ModalHeader> Balance Options </ModalHeader>
            <ModalCloseButton />
            <ModalBody> 
                <>
                    <Input 
                        placeholder = "Masukkan uang" 
                        className = "mb-8 mt-4"
                        pattern="[0-9]*"
                        value={money}
                        onChange={(e) => setMoney((v) => (e.target.validity.valid ? e.target.value : v))} 
                    />
                    <div className = "md:grid-cols-2 grid grid-flow-col gap-x-8">
                        <Button className = "w-full"
                            leftIcon={<MinusIcon />} 
                            color = 'white' 
                            borderColor='#E53E3E'
                            bg = "#E53E3E"
                            variant='solid' 
                            borderRadius='6px' 
                            _hover={{ boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75)' }} 
                            _active={{bg: '#E53E3E', transform: 'scale(1.03)', borderColor: '#E53E3E',}}
                            onClick = {() => props.withdrawMoney(money)}
                            > Withdraw! 
                        </Button>
                        <Button className = "w-full"
                            rightIcon={<AddIcon />} 
                            color = 'white' 
                            borderColor='#22c55e' 
                            bg = "#22c55e" 
                            variant='solid' 
                            borderRadius='6px' 
                            _hover={{ boxShadow: '0 0 1px 2px rgba(88, 144, 255, .75)' }} 
                            _active={{bg: '#22c55e', transform: 'scale(1.03)', borderColor: '#bec3c9',}}
                            onClick = {() => props.addMoney(money)}
                            > Add! 
                        </Button>
                    </div>
                </>
            </ModalBody>

            <ModalFooter className = "text-center">
                <Button colorScheme='blue' mr={3} onClick={props.onClose}>
                    Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  )
}

export default ModalView