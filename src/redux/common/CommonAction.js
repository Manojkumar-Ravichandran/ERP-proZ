import CommonTypes from "./CommonTypes";

export const setAppLoader = (payload) => ({
    type: CommonTypes.SET_APP_LOADER,
    payload,
});

export const setLocation = (payload) => ({
    type: CommonTypes.SET_LOCATION,
    payload,
});
export const resetLocation = (payload) => ({
    type: CommonTypes.RESET_LOCATION,
    payload,
});
export const shippingAddressListInprogress = (payload) => ({
    type: CommonTypes.SHIPPING_ADDRESS_LIST_INPROGRESS,
    payload,
});
export const shippingAddressListSuccess = (payload) => ({
    type: CommonTypes.SHIPPING_ADDRESS_LIST_SUCCESS,
    payload,
});
export const shippingAddressListError = (payload) => ({
    type: CommonTypes.SHIPPING_ADDRESS_LIST_ERROR,
    payload,
});

export const billingAddressListInprogress = (payload) => ({
    type: CommonTypes.BILLING_ADDRESS_LIST_INPROGRESS,
    payload,
});
export const billingAddressListSuccess = (payload) => ({
    type: CommonTypes.BILLING_ADDRESS_LIST_SUCCESS,
    payload,
});
export const billingAddressListError = (payload) => ({
    type: CommonTypes.BILLING_ADDRESS_LIST_ERROR,
    payload,
});
  
