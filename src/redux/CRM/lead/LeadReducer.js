/* eslint-disable default-case */
import { DEFAULT_STORE_OBJECT } from "../../../contents/Common";
import LeadTypes from "./LeadTypes";

const initialState = {
  leadList: {
    ...DEFAULT_STORE_OBJECT,
    data: [],
    total: 0,
    per_page: 10,
    from: 1,
    current_page: 1,
    last_page: 0,
  },
  createLead: { ...DEFAULT_STORE_OBJECT },
  updateLeadData: { ...DEFAULT_STORE_OBJECT },
  deleteLead: { ...DEFAULT_STORE_OBJECT },
  leadVerify:{...DEFAULT_STORE_OBJECT},
  leadDetail: { ...DEFAULT_STORE_OBJECT },
  leadStageList: { ...DEFAULT_STORE_OBJECT, data: [] },
  leadSourceList: { ...DEFAULT_STORE_OBJECT, data: [] },
  createLeadActivity: { ...DEFAULT_STORE_OBJECT },
};

const LeadReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LeadTypes.CREATE_LEAD_PROGRESS: {
      return {
        ...state,
        createLead: {
          ...DEFAULT_STORE_OBJECT,
          progressing: true,
          data: {},
        },
      };
    }

    case LeadTypes.CREATE_LEAD_SUCCESS: {
      return {
        ...state,
        createLead: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          ...payload,
        },
      };
    }

    case LeadTypes.CREATE_LEAD_ERROR: {
      return {
        ...state,
        createLead: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
        },
      };
    }
    case LeadTypes.CREATE_LEAD_RESET: {
      return {
        ...state,
        createLead: {
          ...DEFAULT_STORE_OBJECT,
          
        },
      };
    }

    case LeadTypes.GET_LEAD_LIST_PROGRESS: {
      return {
        ...state,
        leadList: {
          ...DEFAULT_STORE_OBJECT,
          ...state.leadList,
          progressing: true,
        },
      };
    }

    case LeadTypes.GET_LEAD_LIST_SUCCESS: {
      return {
        ...state,
        leadList: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          data: [...payload.data.data.data],
          total: payload.data.data.total,
          per_page: payload.data.data.per_page,
          from: payload.data.data.from,
          current_page: payload.data.data.current_page,
          last_page: payload.data.data.last_page,
        },
      };
    }

    case LeadTypes.GET_LEAD_LIST_ERROR: {
      return {
        ...state,
        leadList: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
          data: [...state.leadList.data],
        },
      };
    }

    case LeadTypes.SET_LEAD_LIST: {
      return {
        ...state,
        leadList: {
          ...DEFAULT_STORE_OBJECT,
          // totalRecords: 0,
          ...state.leadList,
          ...payload,
        },
      };
    }
    case LeadTypes.SET_LEAD_UPDATE_PROGRESS: {
      return {
        ...state,
        updateLeadData: {
          ...DEFAULT_STORE_OBJECT,
          // totalRecords: 0,
          progressing: true,
          ...payload,
        },
      };
    }
    case LeadTypes.SET_LEAD_UPDATE_SUCCESS: {
      return {
        ...state,
        updateLeadData: {
          ...DEFAULT_STORE_OBJECT,
          // totalRecords: 0,
          success: true,
          ...payload,
        },
      };
    }
    case LeadTypes.SET_LEAD_UPDATE_ERROR: {
      return {
        ...state,
        updateLeadData: {
          ...DEFAULT_STORE_OBJECT,
          // totalRecords: 0,
          error: true,
          ...payload,
        },
      };
    }
    case LeadTypes.SET_LEAD_DETAIL_PROGRESS: {
      return {
        ...state,
        leadDetail: {
          ...DEFAULT_STORE_OBJECT,
          // totalRecords: 0,
          progressing: true,
          ...payload,
        },
      };
    }
    case LeadTypes.SET_LEAD_DETAIL_SUCCESS: {
      return {
        ...state,
        leadDetail: {
          ...DEFAULT_STORE_OBJECT,
          // totalRecords: 0,
          data: payload.data.data,
          followup:payload.data.followup_data,
          upcomming:payload.data.up_activity_data,
          pipeline:payload.data.pipeline,          
          success: true,
          paylaod :{...payload.data},
        },
      };
    }
    case LeadTypes.SET_LEAD_DETAIL_ERROR: {
      return {
        ...state,
        leadDetail: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
        },
      };
    }
    case LeadTypes.RESET_LEAD_DETAIL: {
      return {
        ...state,
        leadDetail: {
          ...DEFAULT_STORE_OBJECT,
        },
      };
    }
    case LeadTypes.DELETE_LEAD_PROGRESS: {
      return {
        ...state,
        deleteLead: {
          ...DEFAULT_STORE_OBJECT,
          // totalRecords: 0,
          progressing: true,
          data: [],
        },
      };
    }
    case LeadTypes.DELETE_LEAD_SUCCESS: {
      return {
        ...state,
        updateLeadData: {
          ...DEFAULT_STORE_OBJECT,
          // totalRecords: 0,
          success: true,
          ...payload,
        },
      };
    }
    case LeadTypes.DELETE_LEAD_ERROR: {
      return {
        ...state,
        deleteLead: {
          ...DEFAULT_STORE_OBJECT,
          // totalRecords: 0,
          error: true,
          ...payload,
        },
      };
    }

    case LeadTypes.GET_LEAD_STAGE_PROGRESS: {
      return {
        ...state,
        leadStageList: {
          ...DEFAULT_STORE_OBJECT,
          ...state.leadStageList,
          progressing: true,
        },
      };
    }

    case LeadTypes.GET_LEAD_STAGE_SUCCESS: {
      return {
        ...state,
        leadStageList: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          data: [...payload?.data],
        },
      };
    }

    case LeadTypes.GET_LEAD_STAGE_ERROR: {
      return {
        ...state,
        leadStageList: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
          data: [...state.leadStageList.data],
        },
      };
    }
    case LeadTypes.GET_LEAD_SOURCE_PROGRESS: {
      return {
        ...state,
        leadSourceList: {
          ...DEFAULT_STORE_OBJECT,
          ...state.leadStageList,
          progressing: true,
        },
      };
    }

    case LeadTypes.GET_LEAD_SOURCE_SUCCESS: {
      return {
        ...state,
        leadSourceList: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          data: [...payload.data],
        },
      };
    }

    case LeadTypes.GET_LEAD_SOURCE_ERROR: {
      return {
        ...state,
        leadSourceList: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
          data: [...state.leadSourceList.data],
        },
      };
    }
    case LeadTypes.CREATE_LEAD_ACTIVITY_INPROGRESS: {
      return {
        ...state,
        createLeadActivity: {
          ...DEFAULT_STORE_OBJECT,
          progressing: true,
          data: {},
        },
      };
    }

    case LeadTypes.CREATE_LEAD_ACTIVITY_SUCCESS: {
      return {
        ...state,
        createLeadActivity: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          ...payload,
        },
      };
    }

    case LeadTypes.CREATE_LEAD_ACTIVITY_ERROR: {
      return {
        ...state,
        createLeadActivity: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
        },
      };
    }

    case LeadTypes.LEAD_CONTACT_VERIFY_INPROGRESS: {
      return {
        ...state,
        leadVerify: {
          ...DEFAULT_STORE_OBJECT,
          progressing: true,
          data: {},
        },
      };
    }

    case LeadTypes.LEAD_CONTACT_VERIFY_SUCCESS: {
      return {
        ...state,
        leadVerify: {
          ...DEFAULT_STORE_OBJECT,
          success: true,
          ...payload,
        },
      };
    }

    case LeadTypes.LEAD_CONTACT_VERIFY_ERROR: {
      return {
        ...state,
        leadVerify: {
          ...DEFAULT_STORE_OBJECT,
          error: true,
          ...payload,
        },
      };
    }


    default:
      return state;
  }
};

export default LeadReducer;
