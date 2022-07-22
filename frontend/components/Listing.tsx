import { Modal, Avatar, Collapse, Image, Container, Text } from "@nextui-org/react"

export const Listing = ({ title, price, seller, state, visible, onClose }: { title: string, price: string, seller: string, state: boolean, visible: boolean, onClose: () => void }) => {

  return (
    <Modal
      noPadding
      aria-labelledby="modal-title"
      open={visible}
      onClose={onClose}
    >
      <Modal.Header>
        {title}
        <Image
          showSkeleton
          src="https://github.com/nextui-org/nextui/blob/next/apps/docs/public/nextui-banner.jpeg?raw=true"
          alt="Default Image"
        />
      </Modal.Header>
      <Modal.Body>
        <Container gap={2}>
          <Text>Owner:</Text>
          <Avatar
            size="lg"
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            color="primary"
            bordered
          />
          <Text>{seller}</Text>

          <Collapse
            bordered
            title="Details about 'NFT NAME'"
            subtitle="'NFT NAME's properties"
          >
            <Text>{price}</Text>
            <Text>{state}</Text>
          </Collapse>
        </Container>
      </Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </Modal>
  )
}