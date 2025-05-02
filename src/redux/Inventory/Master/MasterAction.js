import {
  INVENTORYMASTER_CREATE, INVENTORYMASTER_UPDATE,
  INVENTORYMASTER_FETCH, INVENTORYMASTER_SUCCESS, INVENTORYMASTER_OVERVIEWMATERIALLIST,
  INVENTORYMASTER_FAILURE, INVENTORYMASTER_DELETE, INVENTORYMASTER_OVERVIEWASSETSLIST,
  INVENTORYMASTER_DETAIL, INVENTORYMASTER_OVERVIEWDETAIL, INVENTORYMASTER_OVERVIEWITEMLIST
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
export const fetchInventoryMaster = ({ page, per_page,search }) => ({
  type: INVENTORYMASTER_FETCH,
  payload: { page, per_page,search },
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

export const inventoryDetailMaster = (uuid) => ({
  type: INVENTORYMASTER_DETAIL,
  payload: uuid,
});

export const inventoryDetailOverviewMaster = (uuid) => ({
  type: INVENTORYMASTER_OVERVIEWDETAIL,
  payload: uuid,
});

export const fetchItemListOverviewMaster = (uuid, callback) => ({
  type: INVENTORYMASTER_OVERVIEWITEMLIST,
  payload: { uuid, callback },
});

export const fetchAssetsListOverviewMaster = (uuid, callback) => ({
  type: INVENTORYMASTER_OVERVIEWASSETSLIST,
  payload: { uuid, callback },
});

export const fetchMaterialListOverviewMaster = (uuid, callback) => ({
  type: INVENTORYMASTER_OVERVIEWMATERIALLIST,
  payload: { uuid, callback },
}); 