export const handleError = (error, functionName) => {
    console.error(`Error in ${functionName}:`, error);
    if (error.code === "ERR_NETWORK") {
      // RemoveUserLocalStorage();
      // window?.location?.reload();
      return
    }
    return {
      data: {
        status: "error",
        message: error?.response?.data?.data || "An unexpected error occurred.",
      },
    };
  };
  