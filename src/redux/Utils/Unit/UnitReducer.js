import { DEFAULT_STORE_OBJECT } from "../../../contents/Common";
import { createUnitConversionEffect } from "./UnitEffect";
import UnitTypes from "./UnityTypes";

const initialState = {
    unitList: {
      ...DEFAULT_STORE_OBJECT,
      data: [],
      total: 0,
      per_page: 10,
      from: 1,
      current_page: 1,
      last_page: 0,
    },
    createUnit: { ...DEFAULT_STORE_OBJECT },
    updateUnit: { ...DEFAULT_STORE_OBJECT },
    unitConversionList:{
      ...DEFAULT_STORE_OBJECT,
      data: [],
      total: 0,
      per_page: 10,
      from: 1,
      current_page: 1,
      last_page: 0,
    },
    createUnitConversion: {...DEFAULT_STORE_OBJECT},
    updateUnitConversion:{...DEFAULT_STORE_OBJECT},
    deleteUnitConversion:{
      loading: false,
      success: false,
      error: null,
    }
  };

  const UnitReducer = (state = initialState, { type, payload }) => {
    switch (type) {
      case UnitTypes.CREATE_UNIT_PROGRESS: {
        return {
          ...state,
          createUnit: {
            ...DEFAULT_STORE_OBJECT,
            progressing: true,
            data: {},
          },
        };
      }
      case UnitTypes.CREATE_UNIT_SUCCESS: {
        return {
          ...state,
          createUnit: {
            ...DEFAULT_STORE_OBJECT,
            success: true,
            ...payload,
          },
        };
      }
      case UnitTypes.CREATE_UNIT_ERROR: {
        return {
          ...state,
          createUnit: {
            ...DEFAULT_STORE_OBJECT,
            error: true,
            ...payload,
          },
        };
      }
      case UnitTypes.CREATE_UNIT_RESET: {
        return {
          ...state,
          createUnit: {
            ...DEFAULT_STORE_OBJECT,
            success: false,
            error: false,
            data: [],
            message:""
          },
        };
      }
  
        case UnitTypes.GET_UNIT_PROGRESS: {
          return {
            ...state,
            unitList: {
              ...DEFAULT_STORE_OBJECT,
              progressing: true,
              ...state.unitList
            },
          };
        }
        case UnitTypes.GET_UNIT_SUCCESS: {
          return {
            ...state,
            unitList: {
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
        case UnitTypes.GET_UNIT_ERROR: {
          return {
            ...state,
            unitList: {
              ...DEFAULT_STORE_OBJECT,
              error: true,
              ...payload,
              data: [...state.data],
  
            },
          };
        }
        
        case UnitTypes.UPDATE_UNIT_PROGRESS: {
          return {
            ...state,
            updateUnit: {
              ...DEFAULT_STORE_OBJECT,
              progressing: true,
              ...payload
            },
          };
        }
        case UnitTypes.UPDATE_UNIT_SUCCESS: {
          return {
            ...state,
            updateUnit: {
              ...DEFAULT_STORE_OBJECT,
              success: true,
            ...payload,
            },
          };
        }
        case UnitTypes.UPDATE_UNIT_ERROR: {
          return {
            ...state,
            updateUnit: {
              ...DEFAULT_STORE_OBJECT,
              error: true,
              ...payload,
  
            },
          };
        }
  
        case UnitTypes.UPDATE_UNIT_RESET: {
          return {
            ...state,
            updateUnit: {
              ...DEFAULT_STORE_OBJECT,
              success: false,
              error: false,
              data: [],
              message:""
            },
          };
        }
        // ////////////////////////////////////////////
        case UnitTypes.CREATE_UNIT_CONVERSION_PROGRESS: {
          return {
            ...state,
            createUnitConversion: {
              ...DEFAULT_STORE_OBJECT,
              progressing: true,
              data: {},
            },
          };
        }
        case UnitTypes.CREATE_UNIT_CONVERSION_SUCCESS: {
          return {
            ...state,
            createUnitConversion: {
              ...DEFAULT_STORE_OBJECT,
              success: true,
              ...payload, // Ensure payload has `data` and `message` fields
            },
          };
        }
        case UnitTypes.CREATE_UNIT_CONVERSION_ERROR: {
          return {
            ...state,
            createUnitConversion: {
              ...DEFAULT_STORE_OBJECT,
              error: true,
              ...payload, // Ensure payload includes error details
            },
          };
        }
        case UnitTypes.CREATE_UNIT_CONVERSION_RESET: {
          return {
            ...state,
            createUnitConversion: {
              ...DEFAULT_STORE_OBJECT,
              success: false,
              error: false,
              data: [],
              message: "",
            },
          };
        }
        case UnitTypes.GET_UNIT_CONVERSION_PROGRESS: {
          return {
            ...state,
            unitConversionList: {
              ...DEFAULT_STORE_OBJECT,
              progressing: true,
              ...state.unitConversionList, // Ensure state is merged correctly
            },
          };
        }
        case UnitTypes.GET_UNIT_CONVERSION_SUCCESS: {
          return {
            ...state,
            unitConversionList: {
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
        case UnitTypes.GET_UNIT_CONVERSION_ERROR: {
          return {
            ...state,
            unitConversionList: {
              ...DEFAULT_STORE_OBJECT,
              error: true,
              ...payload,
              data: [...state.data], // Use correct state path
            },
          };
        }
        case UnitTypes.UPDATE_UNIT_CONVERSION_PROGRESS: {
          return {
            ...state,
            updateUnitConversion: {
              ...DEFAULT_STORE_OBJECT,
              progressing: true,
              ...payload
            },
          };
        }
        case UnitTypes.UPDATE_UNIT_CONVERSION_SUCCESS: {
          return {
            ...state,
            updateUnitConversion: {
              ...DEFAULT_STORE_OBJECT,
              success: true,
            ...payload,
            },
          };
        }
        case UnitTypes.UPDATE_UNIT_CONVERSION_ERROR: {
          return {
            ...state,
            updateUnitConversion: {
              ...DEFAULT_STORE_OBJECT,
              error: true,
              ...payload,
  
            },
          };
        }
  
        case UnitTypes.UPDATE_UNIT_CONVERSION_RESET: {
          return {
            ...state,
            updateUnitConversion: {
              ...DEFAULT_STORE_OBJECT,
              success: false,
              error: false,
              data: [],
              message:""
            },
          };
        }
        case UnitTypes.DELETE_UNIT_CONVERSION_PROGRESS:
          return {
            ...state,
            deleteUnitConversion: {
              loading: true,
              success: false,
              error: null,
            },
          };
        
        case UnitTypes.DELETE_UNIT_CONVERSION_SUCCESS:
          return {
            ...state,
            deleteUnitConversion: {
              loading: false,
              success: true,
              error: null,
            },
          };
        
        case UnitTypes.DELETE_UNIT_CONVERSION_ERROR:
          return {
            ...state,
            deleteUnitConversion: {
              loading: false,
              success: false,
              error: payload, // Corrected to use 'payload'
            },
          };
        
      default:
        return state;
    }
  };
  
  export default UnitReducer;
  