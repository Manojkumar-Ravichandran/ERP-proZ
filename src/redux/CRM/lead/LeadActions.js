import LeadTypes from "./LeadTypes";

export const createLeadInprogress =(payload)=>{
    return {type:LeadTypes.CREATE_LEAD_PROGRESS,payload}
}

export const createLeadInSuccess = (payload) => {
    return { type: LeadTypes.CREATE_LEAD_SUCCESS, payload };
};
  
export const createLeadInError = (payload) => {
    return { type: LeadTypes.CREATE_LEAD_ERROR, payload };
};
export const createLeadReset = (payload) => {
    return { type: LeadTypes.CREATE_LEAD_RESET, payload };
};

export const getLeadListInProgress = (payload) => {
    return { type: LeadTypes.GET_LEAD_LIST_PROGRESS, payload };
};
  
export const getLeadListInSuccess = (payload) => {
    return { type: LeadTypes.GET_LEAD_LIST_SUCCESS, payload };
};
  
export const getLeadListInError = (payload) => {
    return { type: LeadTypes.GET_LEAD_LIST_ERROR, payload };
};
  
export const setLeadList = (payload) => {
    return { type: LeadTypes.SET_LEAD_LIST, payload };
};
  
export const updateLeadInprogress = (payload) => {
    return { type: LeadTypes.SET_LEAD_UPDATE_PROGRESS, payload };
};
export const updateLeadInSuccess= (payload) => {
    return { type: LeadTypes.SET_LEAD_UPDATE_SUCCESS, payload };
};
  
export const updateLeadInError = (payload) => {
    return { type: LeadTypes.SET_LEAD_UPDATE_ERROR, payload };
};

export const setLeadDetailInprogress = (payload) => {
    return { type: LeadTypes.SET_LEAD_DETAIL_PROGRESS, payload };
};

export const setLeadDetailInSuccess= (payload) => {
    return { type: LeadTypes.SET_LEAD_DETAIL_SUCCESS, payload };
};
  
export const setLeadDetailInError = (payload) => {
    return { type: LeadTypes.SET_LEAD_DETAIL_ERROR, payload };
};
export const resetLeadDetail = (payload) => {
    return { type: LeadTypes.SET_LEAD_DETAIL_ERROR, payload };
};
export const deleteLeadInprogress = (payload) => {
    return { type: LeadTypes.DELETE_LEAD_PROGRESS, payload };
};
  
export const deleteLeadInSuccess= (payload) => {
    return { type: LeadTypes.DELETE_LEAD_SUCCESS, payload };
};
  
export const deleteLeadInError = (payload) => {
    return { type: LeadTypes.DELETE_LEAD_ERROR, payload };
};

export const getLeadStageListInprogress =(payload)=>{
    return { type:LeadTypes.GET_LEAD_STAGE_PROGRESS,payload}
}

export const getLeadStageListSuccess =(payload)=>{
    return { type:LeadTypes.GET_LEAD_STAGE_SUCCESS,payload}
}

export const getLeadStageListError =(payload)=>{
    return { type:LeadTypes.GET_LEAD_STAGE_ERROR,payload}
}

export const getLeadSourceListInprogress =(payload)=>{

    return { type:LeadTypes.GET_LEAD_SOURCE_PROGRESS,payload}
}

export const getLeadSourceListSuccess =(payload)=>{
    return { type:LeadTypes.GET_LEAD_SOURCE_SUCCESS,payload}
}

export const getLeadSourceListError =(payload)=>{
    return { type:LeadTypes.GET_LEAD_SOURCE_ERROR,payload}
}

export const createLeadActivityInprogress =(payload)=>{
    return {type:LeadTypes.CREATE_LEAD_ACTIVITY_INPROGRESS,payload}
}

export const createLeadActivityInSuccess = (payload) => {
    return { type: LeadTypes.CREATE_LEAD_ACTIVITY_SUCCESS, payload };
};
  
export const createLeadActivityInError = (payload) => {
    return { type: LeadTypes.CREATE_LEAD_ACTIVITY_ERROR, payload };
};
export const leadContactVerifyInprogress =(payload)=>{
    return {type:LeadTypes.LEAD_CONTACT_VERIFY_INPROGRESS,payload}
}

export const leadContactVerifySuccess = (payload) => {
    return { type: LeadTypes.LEAD_CONTACT_VERIFY_SUCCESS, payload };
};
  
export const leadContactVerifyError = (payload) => {
    return { type: LeadTypes.LEAD_CONTACT_VERIFY_ERROR, payload };
};
