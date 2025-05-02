import {
  MATERIALTRANSFER_CREATE,
  MATERIALTRANSFER_UPDATE,
  MATERIALTRANSFER_FETCH,
  MATERIALTRANSFER_SUCCESS,
  MATERIALTRANSFER_FAILURE,
  MATERIALTRANSFER_DELETE,
} from "./MaterialTransferTypes";

export const createMaterialTransfer = (data) => ({
  type: MATERIALTRANSFER_CREATE,
  payload: data,
});

export const updateMaterialTransfer = (data) => ({
  type: MATERIALTRANSFER_UPDATE,
  payload: data,
});

export const fetchMaterialTransfer = ({ page, per_page }) => ({
  type: MATERIALTRANSFER_FETCH,
  payload: { page, per_page },
});

export const MaterialTransferSuccess = (data) => ({
  type: MATERIALTRANSFER_SUCCESS,
  payload: data,
});

export const MaterialTransferFailure = (error) => ({
  type: MATERIALTRANSFER_FAILURE,
  payload: error,
});

// export const deleteMaterialTransfer = (payload) => ({
//   type: MATERIALTRANSFER_DELETE,
//   payload,
// });
