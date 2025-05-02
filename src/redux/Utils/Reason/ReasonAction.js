import {
  REASON_CREATE,
  REASON_UPDATE,
  REASON_FETCH,
  REASON_SUCCESS,
  REASON_FAILURE,
  REASON_DELETE,

} from "./ReasonTypes";

export const createReason = (data) => ({
  type: REASON_CREATE,
  payload: data,
});

export const updateReason = (data) => ({
  type: REASON_UPDATE,
  payload: data,
});

export const fetchReason = ({ page, per_page }) => ({
  type: REASON_FETCH,
  payload: { page, per_page },
});

export const ReasonSuccess = (data) => ({
  type: REASON_SUCCESS,
  payload: data,
});

export const ReasonFailure = (error) => ({
  type: REASON_FAILURE,
  payload: error,
});

export const deleteReason = (payload) => ({
  type: REASON_DELETE,
  payload,
});
