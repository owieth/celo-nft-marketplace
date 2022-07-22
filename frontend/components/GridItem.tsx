import { Card, Text, Row, Button, Input, Modal } from "@nextui-org/react"
import { useState } from "react";
import { Listing } from "./Listing";

type Item = {
  title: string;
  price: string;
  img: string;
}

export const GridItem = ({ title, price, img }: Item) => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Card isPressable onPress={() => setVisible(true)}>
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            src={"https://nextui.org" + img}
            objectFit="cover"
            width="100%"
            height={140}
            alt={title}
          />
        </Card.Body>
        <Card.Footer css={{ justifyItems: "flex-start" }}>
          <Row wrap="wrap" justify="space-between" align="center">
            <Text b>{title}</Text>
            <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
              {price}
            </Text>
          </Row>
        </Card.Footer>
      </Card>

      <Listing
        title={title}
        price={price}
        seller={title}
        state={true}
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </>
  );
}