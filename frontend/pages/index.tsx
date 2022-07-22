import { Container, Grid, Text } from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { CreateListing } from '../components/CreateListing';
import { Listings } from '../components/Listings';

const Home: NextPage = () => {
  const { isConnected } = useAccount();

  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // https://github.com/vercel/next.js/discussions/35773 -> 🙂 smh
  useEffect(() => {
    setIsWalletConnected(isConnected);
  }, [isConnected])

  return (
    <>
      <Grid.Container gap={2} alignItems="center">
        <Grid xs={6} alignItems="center" direction='column'>
          <Text h1>🖼️ Celo NFT Marketplace</Text>
          <Text h3>Your immortal API on the blockchain!</Text>
        </Grid>

        <Grid xs={6} justify="flex-end">
          <ConnectButton />
        </Grid>
      </Grid.Container>

      {isWalletConnected && <>
        <CreateListing />

        <Container display='flex' justify='center' gap={10}>
          <Listings />
        </Container>
      </>}

      {!isWalletConnected && <Text h4>Connect a Wallet to start!</Text>}
    </>
  );
}

export default Home