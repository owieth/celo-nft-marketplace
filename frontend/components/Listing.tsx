import { Button, Collapse, Container, Image, Input, Modal, Text, User } from "@nextui-org/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAccount, useContract, useProvider } from "wagmi";
import ERC721ABI from "../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json";

type ListingType = {
  title: string;
  seller: string;
  price: string;
  visible: boolean;
  onClose: () => void;
}


export const Listing = ({ title, seller, price, visible, onClose }: ListingType) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const provider = useProvider();
  const { address } = useAccount();
  const ERC721Contract = useContract({
    addressOrName: "props.nftAddress",
    contractInterface: ERC721ABI.abi,
    signerOrProvider: provider,
  });

  const isOwner = address?.toLowerCase() === seller.toLowerCase();

  const ImageOverflow = styled.div`
    position: relative;
    text-align: center;
    
    h3 {
      position: absolute;
      top: 8px;
      left: 16px;
      z-index: 1;
    }
  `;

  useEffect(() => {
    fetchListingDetails();
  }, []);

  async function fetchListingDetails() {
    try {
      let tokenURI = await ERC721Contract.tokenURI(0);
      tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

      const metadata = await fetch(tokenURI);
      const metadataJSON = await metadata.json();

      setName(metadataJSON.name);
      setLoading(false);
    } catch (error) { }
  }

  return (
    <Modal
      width="500px"
      aria-labelledby="modal-title"
      open={visible}
      onClose={onClose}
    >
      <Modal.Header noPadding>
        <ImageOverflow>
          <Text h3 i>{title}</Text>
          <Image
            showSkeleton
            src="https://github.com/nextui-org/nextui/blob/next/apps/docs/public/nextui-banner.jpeg?raw=true"
            alt="Default Image"
          />
        </ImageOverflow>
      </Modal.Header>
      <Modal.Body>
        <User
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          name="Ariana Wattson"
          description="Owner"
        />
        <Collapse
          bordered
          expanded
          title={`Details about ${title}`}
          subtitle={`${title}'s properties`}
        >
          <Container gap={0.1}>
            <Input
              bordered
              readOnly={false}
              label="Price"
              //type="number"
              labelRight="CELO"
              initialValue={price.toString()}
            />
            <br />
            <Input
              readOnly
              bordered
              label="State"
              //color="default"
              status="warning"
              initialValue={"sdfa"}
            />
          </Container>
        </Collapse>
      </Modal.Body>
      <Modal.Footer>
        <Button shadow auto>
          Buy Listing
        </Button>
        <Button shadow auto>
          Update Listing
        </Button>
        <Button shadow color="error" auto>
          Withdraw Listing
        </Button>
      </Modal.Footer>
    </Modal >
  )
}