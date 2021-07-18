import { AxesOptional } from './state';
import Types from './types';

export type InnerSetStateAxes = {
  type: Types.INNER_SET_STATE_AXES;
  payload: {
    axes: AxesOptional;
  };
};

export type InnerResetStateAxes = {
  type: Types.INNER_RESET_STATE_AXES;
};

export type SetLiveInput = {
  type: Types.SET_LIVE_INPUT;
  payload: boolean;
};

//
//
//

export type InnerAction =
  // actions that are wrapped in an async and should not be called directly
  | InnerSetStateAxes
  | InnerResetStateAxes
  | { type: Types.INNER_SET_NEW_CALC; payload: {} }
  | { type: Types.INNER_SET_NEW_STORE; payload: {} };

export type AsyncAction =
  | {
      type: Types.SET_AXES;
      payload: { axes: AxesOptional };
    }
  | { type: Types.RESET_AXES };

export type OuterAction = SetLiveInput;

export type Action = InnerAction | OuterAction;