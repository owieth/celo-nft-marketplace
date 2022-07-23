import { Button, Input, Loading, Modal, Text } from "@nextui-org/react";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useContractWrite, useSigner, useWaitForTransaction } from "wagmi";
import ERC721ABI from "../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json";
import MARKETPLACEABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { MARKETPLACE_ADDRESS, NFT_ADDRESS } from "../constants";

export const CreateListing = () => {
  const [visible, setVisible] = useState(false);
  const [tokenId, setTokenId] = useState("0");
  const [price, setPrice] = useState('0.1');
  const [nftAddress, setNftAddress] = useState("")
  const [loading, setLoading] = useState(false);

  const { data: signer } = useSigner();

  const contractConfigMarketplace = {
    addressOrName: MARKETPLACE_ADDRESS,
    contractInterface: MARKETPLACEABI.abi,
  };

  const contractConfigNFT = {
    addressOrName: NFT_ADDRESS,
    contractInterface: ERC721ABI.abi,
  };

  const {
    writeAsync: approval
  } = useContractWrite({
    ...contractConfigNFT, functionName: 'approve',
    overrides: { gasLimit: 1e7 },
    args: [signer?.getAddress(), 0]
  });

  const {
    data: mintData,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    writeAsync: mint
  } = useContractWrite({
    ...contractConfigMarketplace, functionName: 'createListing',
    overrides: { gasLimit: 1e7 },
    args: [nftAddress, tokenId, parseEther(price)]
  });

  const { isSuccess: txSuccess, error: txError } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  async function handleCreateListing() {
    setLoading(true);

    //await approval();

    await approval();

    // try {
    //   // Initialize an instance of the marketplace contract
    //   const MarketplaceContract = new Contract(
    //     MARKETPLACE_ADDRESS,
    //     MarketplaceABI.abi,
    //     signer!
    //   );

    //   // Send the create listing transaction
    //   const createListingTxn = await MarketplaceContract.createListing(
    //     nftAddress,
    //     tokenId,
    //     parseEther(price)
    //   );
    //   await createListingTxn.wait();
    // } catch (error) {
    //   console.error(error);
    // }

    setLoading(false);
    setVisible(false);
  }

  useEffect(() => {
    //setNftAddress(ethers.Wallet.createRandom().address)
    setNftAddress("0x7D134b07e10584e13A467d2F8E97169C614d88C4")
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
            //type='number'
            label="NFT Token ID"
            initialValue={tokenId}
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