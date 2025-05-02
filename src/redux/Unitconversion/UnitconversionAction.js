import {
  INVENTORYMASTER_CREATE,
  INVENTORYMASTER_UPDATE,
  INVENTORYMASTER_FETCH,
  INVENTORYMASTER_SUCCESS,
  INVENTORYMASTER_FAILURE,
  INVENTORYMASTER_DELETE,
} from "./MasterTypes";

// Action to create inventory master
export const createInventoryMaster = (data) => ({
  type: INVENTORYMASTER_CREATE,
  payload: data,
});

// Action to update inventory master
export const updateInventoryMaster = (data) => ({
  type: INVENTORYMASTER_UPDATE,
  payload: data,
});

// Action to fetch inventory master with pagination parameters
export const fetchInventoryMaster = ({ page, per_page }) => ({
  type: INVENTORYMASTER_FETCH,
  payload: { page, per_page },
});

// Success action for fetching inventory data
export const inventoryMasterSuccess = (data) => ({
  type: INVENTORYMASTER_SUCCESS,
  payload: data,
});

// Failure action for handling errors
export const inventoryMasterFailure = (error) => ({
  type: INVENTORYMASTER_FAILURE,
  payload: error,
});

export const deleteInventoryMaster = (payload) => ({
  type: INVENTORYMASTER_DELETE,
  payload,
});
