import { Divider, Flex, Text } from '@chakra-ui/react';
import { InferGetStaticPropsType } from 'next';
import React from 'react';

const Footer = () => {
  return (
    <Flex direction="column" mt={12} height="70px" px={4} shadow="sm">
      <Divider />
      <Flex mx="auto" width="100%" maxWidth={1200}>
        <Text mt={4} size="md">
          Copyright © 2021 by Inclined Finance, Inc. All rights reserved.
        </Text>
      </Flex>
    </Flex>
  );
};

export default Footer;
