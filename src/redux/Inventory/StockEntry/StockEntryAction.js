import {
  STOCKENTRY_CREATE,
  STOCKENTRY_UPDATE,
  STOCKENTRY_FETCH,
  STOCKENTRY_SUCCESS,
  STOCKENTRY_FAILURE,
  STOCKENTRY_DELETE,
} from "./StockEntryTypes";

export const createStockEntry = (data) => ({
  type: STOCKENTRY_CREATE,
  payload: data,
});

export const updateStockEntry = (data) => ({
  type: STOCKENTRY_UPDATE,
  payload: data,
});

export const fetchStockEntry = ({ page, per_page,search }) => ({
  type: STOCKENTRY_FETCH,
  payload: { page, per_page,search },
});

export const StockEntrySuccess = (data) => ({
  type: STOCKENTRY_SUCCESS,
  payload: data,
});

export const StockEntryFailure = (error) => ({
  type: STOCKENTRY_FAILURE,
  payload: error,
});

export const deleteStockEntry = (payload) => ({
  type: STOCKENTRY_DELETE,
  payload,
});
