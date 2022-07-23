import { Button, Input, Loading, Modal, Text } from "@nextui-org/react";
import { Contract, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import ERC721ABI from "../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json";
import MarketplaceABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { MARKETPLACE_ADDRESS } from "../constants";

export const CreateListing = () => {
  const [visible, setVisible] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [nftAddress, setNftAddress] = useState("")
  const [loading, setLoading] = useState(false);

  const { data: signer } = useSigner();

  async function handleCreateListing() {
    setLoading(true);

    try {
      await requestApproval();
      await createListing();
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  async function requestApproval() {
    // Get signer's address
    const address = await signer?.getAddress();

    // Initialize a contract instance for the NFT contract
    const ERC721Contract = new Contract(nftAddress, ERC721ABI.abi, signer!);

    // Make sure user is owner of the NFT in question
    const tokenOwner = await ERC721Contract.ownerOf(tokenId);
    if (tokenOwner.toLowerCase() !== address!.toLowerCase()) {
      throw new Error(`You do not own this NFT`);
    }

    // Check if user already gave approval to the marketplace
    const isApproved = await ERC721Contract.isApprovedForAll(
      address,
      MARKETPLACE_ADDRESS
    );

    // If not approved
    if (!isApproved) {
      console.log("Requesting approval over NFTs...");

      // Send approval transaction to NFT contract
      const approvalTxn = await ERC721Contract.setApprovalForAll(
        MARKETPLACE_ADDRESS,
        true
      );
      await approvalTxn.wait();
    }
  }

  async function createListing() {
    // Initialize an instance of the marketplace contract
    const MarketplaceContract = new Contract(
      MARKETPLACE_ADDRESS,
      MarketplaceABI.abi,
      signer!
    );

    // Send the create listing transaction
    const createListingTxn = await MarketplaceContract.createListing(
      nftAddress,
      tokenId,
      parseEther(price)
    );
    await createListingTxn.wait();
  }

  useEffect(() => {
    setNftAddress(ethers.Wallet.createRandom().address)
  }, [])


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
            bordered
            readOnly
            label="Address of NFT"
            initialValue={nftAddress}
          />
          <Input
            bordered
            type='number'
            label="NFT Token ID"
            onChange={(e) => setTokenId(e.target.value)}
          />
          <Input
            bordered
            label="Price (CELO)"
            onChange={(e) => setPrice(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button shadow auto onClick={() => handleCreateListing()}>
            Create Listing
            {loading && <Loading type="points-opacity" color="currentColor" size="sm" />}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}