import { Button, Input, Modal, Text } from "@nextui-org/react";
import { useState } from "react";

export const CreateListing = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button shadow color="gradient" onClick={() => setVisible(true)}>
        Create Listing
      </Button>

      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={() => setVisible(false)}
      >
        <Modal.Header>
          <Text h4>Create a new Listing</Text>
        </Modal.Header>
        <Modal.Body>
          <Text h5>Enter the following attributes:</Text>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Email"
          />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Password"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={() => { }}>
            Create ✅
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}