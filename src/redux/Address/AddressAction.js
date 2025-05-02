import AddressTypes from "./AddressTypes";

export const createBillingAddressInprogress = (payload) => {
  return { type: AddressTypes.CREATE_BILLING_ADDRESS_PROGRESS, payload };
};
export const createBillingAddressInSuccess = (payload) => {
  return { type: AddressTypes.CREATE_BILLING_ADDRESS_SUCCESS, payload };
};
export const createBillingAddressInError = (payload) => {
  return { type: AddressTypes.CREATE_BILLING_ADDRESS_ERROR, payload };
};
export const createBillingAddressInReset = (payload) => {
  return { type: AddressTypes.CREATE_BILLING_ADDRESS_RESET, payload };
};

export const getBillingAddressInprogress = (payload) => {
  return { type: AddressTypes.GET_BILLING_ADDRESS_PROGRESS, payload };
};
export const getBillingAddressInSuccess = (payload) => {
  return { type: AddressTypes.GET_BILLING_ADDRESS_SUCCESS, payload };
};
export const getBillingAddressInError = (payload) => {
  return { type: AddressTypes.GET_BILLING_ADDRESS_ERROR, payload };
};

export const updateBillingAddressInprogress = (payload) => {
  return { type: AddressTypes.UPDATE_BILLING_ADDRESS_PROGRESS, payload };
};
export const updateBillingAddressInSuccess = (payload) => {
  return { type: AddressTypes.UPDATE_BILLING_ADDRESS_SUCCESS, payload };
};
export const updateBillingAddressInError = (payload) => {
  return { type: AddressTypes.UPDATE_BILLING_ADDRESS_ERROR, payload };
};

export const updateBillingAddressInReset = (payload) => {
  return { type: AddressTypes.UPDATE_BILLING_ADDRESS_RESET, payload };
};

export const createShippingAddressInprogress = (payload) => {
  return { type: AddressTypes.CREATE_SHIPPING_ADDRESS_PROGRESS, payload };
};
export const createShippingAddressInSuccess = (payload) => {
  return { type: AddressTypes.CREATE_SHIPPING_ADDRESS_SUCCESS, payload };
};
export const createShippingAddressInError = (payload) => {
  return { type: AddressTypes.CREATE_SHIPPING_ADDRESS_ERROR, payload };
};
export const createShippingAddressInReset = (payload) => {
  return { type: AddressTypes.CREATE_SHIPPING_ADDRESS_RESET, payload };
};

export const getShippingAddressInprogress = (payload) => {
  return { type: AddressTypes.GET_SHIPPING_ADDRESS_PROGRESS, payload };
};
export const getShippingAddressInSuccess = (payload) => {
  return { type: AddressTypes.GET_SHIPPING_ADDRESS_SUCCESS, payload };
};
export const getShippingAddressInError = (payload) => {
  return { type: AddressTypes.GET_SHIPPING_ADDRESS_ERROR, payload };
};

export const updateShippingAddressInprogress = (payload) => {
  return { type: AddressTypes.UPDATE_SHIPPING_ADDRESS_PROGRESS, payload };
};
export const updateShippingAddressInSuccess = (payload) => {
  return { type: AddressTypes.UPDATE_SHIPPING_ADDRESS_SUCCESS, payload };
};
export const updateShippingAddressInError = (payload) => {
  return { type: AddressTypes.UPDATE_SHIPPING_ADDRESS_ERROR, payload };
};

export const updateShippingAddressInReset = (payload) => {
  return { type: AddressTypes.UPDATE_SHIPPING_ADDRESS_RESET, payload };
};
