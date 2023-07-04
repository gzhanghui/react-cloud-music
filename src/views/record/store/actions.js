import * as constants from "./constants";

export const recordRequest = (record) => ({
  type: constants.RECORD_REQUEST,
  payload: { record },
});
