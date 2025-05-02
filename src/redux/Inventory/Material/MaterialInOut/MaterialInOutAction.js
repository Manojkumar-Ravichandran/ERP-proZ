import {
  MATERIALINOUT_CREATE,
  MATERIALINOUT_UPDATE,
  MATERIALINOUT_FETCH,
  MATERIALINOUT_SUCCESS,
  MATERIALINOUT_FAILURE,
} from "./MaterialInOutTypes";

export const createMaterialInOut = (data) => ({
  type: MATERIALINOUT_CREATE,
  payload: data,
});

export const updateMaterialInOut = (data) => ({
  type: MATERIALINOUT_UPDATE,
  payload: data,
});

export const fetchMaterialInOut = ({ page, per_page ,type }) => ({
  type: MATERIALINOUT_FETCH,
  payload: { page, per_page, type },
});

export const MaterialInOutSuccess = (data) => ({
  type: MATERIALINOUT_SUCCESS,
  payload: data,
});

export const MaterialInOutFailure = (error) => ({
  type: MATERIALINOUT_FAILURE,
  payload: error,
});

