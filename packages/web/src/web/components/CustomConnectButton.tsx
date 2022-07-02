import { Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';

export const CustomConnectButton = () => {
  const isMobile = useBreakpointValue({ base: true, sm: false }, 'sm');

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        return (
          <div
            {...(!mounted && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none'
              }
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button size="md" onClick={openConnectModal}>
                    connect
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button size="md" colorScheme="red" onClick={openChainModal}>
                    Wrong network
                  </Button>
                );
              }
              return (
                <Flex>
                  <Button
                    size="md"
                    onClick={openChainModal}
                    variant="outline"
                    alignItems="center"
                    rightIcon={<FaChevronDown />}
                  >
                    {chain.hasIcon && (
                      <Flex
                        style={{
                          background: chain.iconBackground,
                          width: 20,
                          height: 20,
                          borderRadius: '100%',
                          overflow: 'hidden'
                        }}
                      >
                        {chain.iconUrl && (
                          <Image
                            width={20}
                            height={20}
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                          />
                        )}
                      </Flex>
                    )}
                  </Button>
                  <Button
                    ml={2}
                    size="md"
                    onClick={openAccountModal}
                    rightIcon={<FaChevronDown />}
                    variant="outline"
                  >
                    {account.ensAvatar && (
                      <Flex
                        mr={2}
                        style={{
                          // background: chain.iconBackground,
                          width: 20,
                          height: 20,
                          borderRadius: '100%',
                          overflow: 'hidden'
                        }}
                      >
                        {account.ensAvatar && (
                          <Image
                            width={20}
                            height={20}
                            alt={account.displayName ?? 'Avatar icon'}
                            src={account.ensAvatar}
                          />
                        )}
                      </Flex>
                    )}
                    <Text>
                      {!isMobile ? account.displayName : `${account.displayName.slice(0, 6)}...`}
                    </Text>
                  </Button>
                </Flex>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
