import {
  MATERIALREQUEST_CREATE,
  MATERIALREQUEST_APPROVE,
  MATERIALREQUEST_UPDATE,
  MATERIALREQUEST_FETCH,
  MATERIALREQUEST_SUCCESS,
  MATERIALREQUEST_FAILURE,
  MATERIALREQUEST_DELETE,
  MATERIALREQUEST_CANCEL,
  MATERIALREQUEST_DECLINE,
} from "./MaterialRequestTypes";

export const createMaterialRequest = (data) => ({
  type: MATERIALREQUEST_CREATE,
  payload: data,
});

export const updateMaterialRequest = (data) => ({
  type: MATERIALREQUEST_UPDATE,
  payload: data,
});

export const fetchMaterialRequest = ({ page, per_page,search }) => ({
  type: MATERIALREQUEST_FETCH,
  payload: { page, per_page,search },
});

export const MaterialRequestSuccess = (data) => ({
  type: MATERIALREQUEST_SUCCESS,
  payload: data,
});

export const MaterialRequestFailure = (error) => ({
  type: MATERIALREQUEST_FAILURE,
  payload: error,
});

export const deleteMaterialRequest = (payload) => ({
  type: MATERIALREQUEST_DELETE,
  payload,
});

export const approveMaterialRequest = (data) => ({
  type: MATERIALREQUEST_APPROVE,
  payload: data,
});

export const cancelMaterialRequest = (data) => ({
  type: MATERIALREQUEST_CANCEL,
  payload: data,
});

export const declineMaterialRequest = (data) => ({
  type: MATERIALREQUEST_DECLINE,
  payload: data,
});