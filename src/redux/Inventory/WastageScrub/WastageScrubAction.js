import {
  WASTAGESCRUB_CREATE,
  WASTAGESCRUB_UPDATE,
  WASTAGESCRUB_FETCH,
  WASTAGESCRUB_SUCCESS,
  WASTAGESCRUB_FAILURE,
  WASTAGESCRUB_DELETE,
} from "./WastageScrubTypes";

export const createWastageScrub = (data) => ({
  type: WASTAGESCRUB_CREATE,
  payload: data,
});

export const updateWastageScrub = (data) => ({
  type: WASTAGESCRUB_UPDATE,
  payload: data,
});

export const fetchWastageScrub = ({ page, per_page,search }) => ({
  type: WASTAGESCRUB_FETCH,
  payload: { page, per_page,search },
});

export const WastageScrubSuccess = (data) => ({
  type: WASTAGESCRUB_SUCCESS,
  payload: data,
});

export const WastageScrubFailure = (error) => ({
  type: WASTAGESCRUB_FAILURE,
  payload: error,
});

export const deleteWastageScrub = (payload) => ({
  type: WASTAGESCRUB_DELETE,
  payload,
});
