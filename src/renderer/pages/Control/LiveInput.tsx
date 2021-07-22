import React, { useContext } from 'react';
import { Flex, Fade, Button, Text, Switch, Icon } from '@chakra-ui/react';

import {
  Context as ControlContext,
  Types as ControlTypes,
  Axis as ControlAxis,
} from '_renderer/context/ControlContext';
import { IoArrowUpOutline } from 'react-icons/io5';

const LiveInput = () => {
  const { state: controlState, dispatch: controlDispatch } =
    useContext(ControlContext);

  const { liveInput } = controlState;

  const handleClickSendValues = () => {
    controlDispatch({ type: ControlTypes.PUSH_TO_ARDUINO });
  };

  const handleChangeLiveInput = () => {
    controlDispatch({ type: ControlTypes.SET_LIVE_INPUT, payload: !liveInput });
  };

  return (
    <Flex alignItems="center" alignSelf="flex-start" mt={1}>
      <Fade in={!liveInput}>
        <Button
          size="sm"
          mr={4}
          leftIcon={<Icon as={IoArrowUpOutline} />}
          onClick={handleClickSendValues}
        >
          Send Values
        </Button>
      </Fade>
      <Text fontWeight="medium" mr={2}>
        Live Input
      </Text>
      <Switch
        size="md"
        isChecked={liveInput}
        onChange={handleChangeLiveInput}
        colorScheme="blue"
      />
    </Flex>
  );
};

export default LiveInput;