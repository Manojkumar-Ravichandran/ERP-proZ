import {
  ASSETS_CREATE,
  ASSETS_UPDATE,
  ASSETS_FETCH,
  ASSETS_SUCCESS,
  ASSETS_FAILURE,
  ASSETS_DELETE,
  ASSETS_LEND_FETCH,
  ASSETS_LEND_CREATE,
  ASSETS_LEND_RETURN
} from "./AssetsTypes";

export const createAssets = (data) => ({
  type: ASSETS_CREATE,
  payload: data,
});

export const updateAssets = (data) => ({
  type: ASSETS_UPDATE,
  payload: data,
});

export const fetchAssets = ({ page, per_page,search }) => ({
  type: ASSETS_FETCH,
  payload: { page, per_page,search },
});

export const fetchLendAssets = ({ page, per_page }) => ({
  type: ASSETS_LEND_FETCH,
  payload: { page, per_page },
});

export const AssetsSuccess = (data) => ({
  type: ASSETS_SUCCESS,
  payload: data,
});

export const AssetsFailure = (error) => ({
  type: ASSETS_FAILURE,
  payload: error,
});

export const deleteAssets = (payload) => ({
  type: ASSETS_DELETE,
  payload,
});

export const createLendAssets = (data) => ({
  type: ASSETS_LEND_CREATE,
  payload: data,
});

export const returnLendAssets = (data) => ({
  type: ASSETS_LEND_RETURN,
  payload: data,
});