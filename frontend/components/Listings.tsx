import { Grid, Loading, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { createClient } from "urql";
import { useAccount, useContract, useProvider } from "wagmi";
import { Listing } from "../models/Listing";
import { GridItem } from "./GridItem";
import ERC721ABI from "../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json";
import { NFT_ADDRESS } from "../constants";

export const Listings = () => {

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  const { isConnected } = useAccount();

  const provider = useProvider();
  const ERC721Contract = useContract({
    addressOrName: NFT_ADDRESS,
    contractInterface: ERC721ABI.abi,
    signerOrProvider: provider,
  });

  async function fetchListings() {
    setLoading(true);
    const listingsQuery = `
      query ListingsQuery {
        listingEntities {
          id
          nftAddress
          tokenId
          price
          seller
          buyer
        }
      }
    `;

    const urqlClient = createClient({
      url: "https://api.thegraph.com/subgraphs/name/owieth/celo-nft-marketplace",
    });

    const response = await urqlClient.query(listingsQuery).toPromise();
    const listingEntities = response.data.listingEntities;

    let image = await ERC721Contract.tokenURI(0);
    image = image.replace("ipfs://", "https://ipfs.io/ipfs/");

    const activeListings = listingEntities.filter((l: Listing) => l.buyer === null).map((l: Listing) => l.img = image);

    setListings(activeListings);
    setLoading(false);
  }

  useEffect(() => {
    if (isConnected) fetchListings();
  }, []);

  return (
    <Grid.Container gap={2} justify="flex-start">
      {loading && isConnected && <Loading />}

      {!loading && listings && listings.map((listing, index) => (
        <Grid xs={6} sm={3} key={index}>
          <GridItem
            {...listing}
          />
        </Grid>
      ))}

      {!loading && listings && listings.length === 0 && (
        <Text h2>No Listings found 😨</Text>
      )}
    </Grid.Container >
  )
}