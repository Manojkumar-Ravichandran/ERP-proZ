import UnitTypes from "./UnityTypes"

export const createUnitInprogress =(payload)=>{
    return{type:UnitTypes.CREATE_UNIT_PROGRESS,payload}
}
export const createUnitInSuccess =(payload)=>{
    return{type:UnitTypes.CREATE_UNIT_SUCCESS,payload}
}
export const createUnitInError =(payload)=>{
    return{type:UnitTypes.CREATE_UNIT_ERROR,payload}
}
export const createUnitInReset =(payload)=>{
    return{type:UnitTypes.CREATE_UNIT_RESET,payload}
}

export const getUnitInprogress =(payload)=>{
return{type:UnitTypes.GET_UNIT_PROGRESS,payload}
}
export const getUnitInSuccess =(payload)=>{
    return{type:UnitTypes.GET_UNIT_SUCCESS,payload}
}
export const getUnitInError =(payload)=>{
    return{type:UnitTypes.GET_UNIT_ERROR,payload}
}

export const updateUnitInprogress =(payload)=>{
    console.log(payload)
return{type:UnitTypes.UPDATE_UNIT_PROGRESS,payload}
}
export const updateUnitInSuccess =(payload)=>{
    return{type:UnitTypes.UPDATE_UNIT_SUCCESS,payload}
}
export const updateUnitInError =(payload)=>{
    return{type:UnitTypes.UPDATE_UNIT_ERROR,payload}
}

export const updateUnitInReset =(payload)=>{
    return{type:UnitTypes.UPDATE_UNIT_RESET,payload}
}

export const createUnitConversionInprogress = (payload) => {
    return { type: UnitTypes.CREATE_UNIT_CONVERSION_PROGRESS, payload };
};
export const createUnitConversionInSuccess = (payload) => {
    return { type: UnitTypes.CREATE_UNIT_CONVERSION_SUCCESS, payload };
};
export const createUnitConversionInError = (payload) => {
    return { type: UnitTypes.CREATE_UNIT_CONVERSION_ERROR, payload };
};
export const createUnitConversionInReset = (payload) => {
    return { type: UnitTypes.CREATE_UNIT_CONVERSION_RESET, payload };
};

export const updateUnitConversionInprogress =(payload)=>{
    console.log(payload)
return{type:UnitTypes.UPDATE_UNIT_CONVERSION_PROGRESS,payload}
}
export const updateUnitConversionInSuccess =(payload)=>{
    return{type:UnitTypes.UPDATE_UNIT_CONVERSION_SUCCESS,payload}
}
export const updateUnitConversionInError =(payload)=>{
    return{type:UnitTypes.UPDATE_UNIT_CONVERSION_ERROR,payload}
}

export const updateUnitConversionInReset =(payload)=>{
    return{type:UnitTypes.UPDATE_UNIT_CONVERSION_RESET,payload}
}

export const getUnitConversionInprogress = (payload) => {
    return { type: UnitTypes.GET_UNIT_CONVERSION_PROGRESS, payload };
};
export const getUnitConversionInSuccess = (payload) => {
    return { type: UnitTypes.GET_UNIT_CONVERSION_SUCCESS, payload };
};
export const getUnitConversionInError = (payload) => {
    return { type: UnitTypes.GET_UNIT_CONVERSION_ERROR, payload };
};

export const deleteUnitConversionInprogress = (payload) => {
    return { type: UnitTypes.DELETE_UNIT_CONVERSION_PROGRESS, payload };
};
export const deleteUnitConversionInSuccess = (payload) => {
    return { type: UnitTypes.DELETE_UNIT_CONVERSION_SUCCESS, payload };
};
export const deleteUnitConversionInError = (payload) => {
    return { type: UnitTypes.DELETE_UNIT_CONVERSION_ERROR, payload };
};
