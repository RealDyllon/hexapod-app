import { Action, AsyncAction } from './actions';
import { State, initialState, AxesNumber, Axis } from './state';
import { Reducer } from 'react';
import { AsyncActionHandlers } from 'use-reducer-async';
import Types from './types';
import { gcode } from '_/renderer/formulae/gcode';
import {
  baseCoordsTestData,
  constants,
  newAxesTestData,
  newAxesTestData30,
  platformCoordsBasisTestData,
  platformCoordsHomeTestData,
  platformCoordsTestData,
  previousInputTestData,
} from '_/renderer/fixtures/testFixtures';
import delay from 'delay';

export const asyncActionHandlers: AsyncActionHandlers<
  Reducer<State, Action>,
  AsyncAction
> = {
  // todo: add init+home here
  [Types.INIT_ARDUINO]:
    ({ dispatch }) =>
    async (action) => {
      // step 1: math stuff:
      // todo
      dispatch({
        type: Types.INNER_INITIALIZE_STATE,
      });

      // step 2: flush serialport
      // todo

      // step 3: write gcode to serialport
      // todo
    },

  [Types.SET_AXES]:
    ({ dispatch, getState }) =>
    async (action) => {
      const oldState: State = getState();

      dispatch({
        type: Types.INNER_SET_STATE_AXES,
        payload: { axes: action.payload.axes },
      });

      if (oldState.liveInput) {
        await pushToArduino(getState, dispatch);
      }
    },
  [Types.PUSH_TO_ARDUINO]:
    ({ dispatch, getState }) =>
    async (action) => {
      await pushToArduino(getState, dispatch);
    },
  [Types.RESET_AXES]:
    ({ dispatch }) =>
    async (action) => {
      // step 0: update axes in state
      dispatch({
        type: Types.INNER_RESET_STATE_AXES,
      });
      // step 1: take the 6dof array and calculate gcode from that
      //
      // step 2: send the gcode via serialport
      // todo: move serial port code to some function within the control context (thus replacing the serialportContext context)
    },
};

const pushToArduino = async (
  getState: () => State,
  dispatch: React.Dispatch<Action>
) => {
  // step 1: take the 6dof array and calculate gcode from that
  const state: State = getState(); // gets current state (no side effects!)

  const t0 = performance.now();

  const newAxes = Object.fromEntries(
    Object.entries(state.axes).map(([key, value]) => [key, value.current])
  ) as AxesNumber;

  console.log('newAxes', newAxes);

  const { calculated, config } = state;

  const { gcodeString, platformCoords, previousInput, platformCoordsBasis } =
    await gcode(
      calculated.platform.coords,
      newAxes,
      calculated.previousInput,
      calculated.platform.coordsBasis,
      config.platform.homeCoords,
      config.fixedRods.len,
      config.base.coords,
      config.slice.maxChangePerSlice,
      config.slice.minSlicePerMovement
    );

  console.log('gcodeRes', { gcodeString });

  const t1 = performance.now();

  console.log(`⏱ Call to calculate gcode took ${t1 - t0} milliseconds.`);

  dispatch({
    type: Types.INNER_SET_CALCULATED,
    payload: {
      platform: {
        coords: platformCoords,
        coordsBasis: platformCoordsBasis,
      },
      previousInput: previousInput,
    },
  });

  //
  // step 2: send the gcode via serialport
  // todo: move serial port code to some function within the control context (thus replacing the serialportContext context)
};
