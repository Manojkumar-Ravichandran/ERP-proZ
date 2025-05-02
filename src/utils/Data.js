export const findSpecificIdData = (arr, selectedId) => arr.find(list => list.id === selectedId);
export const findSpecificIdDatas = (arr, selectedId) => {
  const data =  arr.find(list => list.value === selectedId);
  return data
};

/* OPTIMIZE THE ARRAY FOR DROPDOWN USE */
export const arrOptForDropdown = (arr, label, value) =>
    arr.map(item => ({ ...item,label: item[label], value: item[value] }));


/* Find First Letter */
export const findFirstLetter = (name,length=1) => {
   const splitedName = name?.trim()?.slice(0,length).toUpperCase() || '';
   return splitedName
};

export const getDefaultDateTime = (daysBefore = 0) => {
    const now = new Date();
    now.setDate(now.getDate() - daysBefore); // Subtract the given number of days
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000) // Adjust for timezone offset
      .toISOString()
      .slice(0, 16); // Keep only YYYY-MM-DDTHH:mm format
};

export const getDefaultDate = (daysBefore = 0) => {
  const now = new Date();
  now.setDate(now.getDate() - daysBefore); // Subtract the given number of days
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000) // Adjust for timezone offset
    .toISOString()
    .slice(0, 10); // Keep only YYYY-MM-DD format
};


export const optimizeAddress = (data) => {

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const optimizedData = {
    ...data,
    address: [
      data?.door_no,
      data?.area,
      data?.landmark,
      data?.district,
      data?.state,
      data?.pincode,
    ]
      .filter(Boolean) // Remove falsy values
      .map((item) => capitalizeFirstLetter(item.toString())) // Capitalize each part
      .join(', '), // Join into a single string
  };
  return optimizedData;
};





