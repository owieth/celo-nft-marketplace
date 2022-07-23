import { Card, Row, Text } from "@nextui-org/react";
import { useState } from "react";
import { Listing as ListingModel } from "../models/Listing";
import { Listing } from "./Listing";

export const GridItem = (listing: ListingModel) => {

  const [visible, setVisible] = useState(false)

  return (
    <>
      <Card isPressable onPress={() => setVisible(true)}>
        <Card.Body style={{ padding: 0 }}>
          <Card.Image
            src={"https://nextui.org" + listing.img}
            objectFit="cover"
            width="100%"
            height={140}
          />
        </Card.Body>
        <Card.Footer css={{ justifyItems: "flex-start" }}>
          <Row wrap="wrap" justify="space-between" align="center">
            <Text b>{listing.title}</Text>
            <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
              {listing.price}
            </Text>
          </Row>
        </Card.Footer>
      </Card>

      <Listing
        title={listing.title}
        seller={listing.seller}
        price={listing.price.toString()}
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </>
  );
}