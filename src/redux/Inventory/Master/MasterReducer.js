import {
  INVENTORYMASTER_CREATE, INVENTORYMASTER_UPDATE,
  INVENTORYMASTER_FETCH, INVENTORYMASTER_SUCCESS, INVENTORYMASTER_OVERVIEWMATERIALLIST,
  INVENTORYMASTER_FAILURE, INVENTORYMASTER_DELETE, INVENTORYMASTER_OVERVIEWASSETSLIST,
  INVENTORYMASTER_DETAIL, INVENTORYMASTER_OVERVIEWDETAIL, INVENTORYMASTER_OVERVIEWITEMLIST
} from "./MasterTypes";

const initialState = {
  inventory: [],
  pagination: { current_page: 1, last_page: 1, total: 0 },
  error: null,
  no_inventory:null,
  volume_occupied:null,
  material_in:null,
  material_out:null,
  asset_count:null,
  masterDetail: null,
  overviewDetail: null,
  inventoryOverviewItems: null,
  inventoryOverviewAssets: null,
  inventoryOverviewMaterial: null,
};

const MasterReducer = (state = initialState, action) => {
  switch (action.type) {
    case INVENTORYMASTER_OVERVIEWMATERIALLIST:
      return {
        ...state,
        inventoryOverviewMaterial: action.payload,
        error: null,
      }
    case INVENTORYMASTER_OVERVIEWASSETSLIST:
      return {
        ...state,
        inventoryOverviewAssets: action.payload,
        error: null,
      }
    case INVENTORYMASTER_OVERVIEWITEMLIST:
      return {
        ...state,
        inventoryOverviewItems: action.payload,
        error: null,
      };
    case INVENTORYMASTER_OVERVIEWDETAIL:
      return {
        ...state,
        overviewDetail: {
          status: action.payload?.status,
          material_request: action.payload?.material_request || 0,
          asset_count: action.payload?.asset_count || 0,
          out_of_stock: action.payload?.out_of_stock || "0",
          chartData: action.payload?.chartData || [],
        },
      };
    case INVENTORYMASTER_CREATE:
    case INVENTORYMASTER_UPDATE:
      return {
        ...state,
        error: null,
      };

    case INVENTORYMASTER_DETAIL:
      return {
        ...state,
        masterDetail: action.payload?.inv_data || null,
      };
    case INVENTORYMASTER_FETCH:
      return {
        ...state,
        error: null,
      };

    case INVENTORYMASTER_SUCCESS:
      return {
        ...state,
        inventory: action.payload?.inventoryData || [],
        pagination: action.payload?.pagination || { current_page: 1, last_page: 1, total: 0 },
        error: null,
        ...action.payload
      };

    case INVENTORYMASTER_FAILURE:
      return {
        ...state,
        error: action.payload || "Failed to fetch inventory",
      };

    case INVENTORYMASTER_DELETE:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default MasterReducer;