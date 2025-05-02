import axios from "axios";
import {
  ExpireTokenInterceptor,
  SetTokenInterceptor,
} from "../../Interceptors";
import { caesarEncrypt } from "../../../utils/enc_dec";
import { getUserLocalStorage } from "../../../utils/utils";
import { handleError } from "../../../utils/ErrorHanler";
const CancelToken = axios.CancelToken;

let leadInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/crm`,
});
leadInstance.defaults.headers.common["Content-Type"] = "application/json";

leadInstance.interceptors.request.use(
  SetTokenInterceptor,
  (config) => new Promise.reject(config)
);

leadInstance.interceptors.response.use(
  (config) => config,
  ExpireTokenInterceptor
);

export const createLeadEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/leads-create",
    method: "post",
    data,
  });
};

let getLeadListEffectCancelToken = () => { };
export const getLeadListEffect = (data) => {
  getLeadListEffectCancelToken();
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leads-list",
    method: "get",
    params: data,
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
    // cancelToken: new CancelToken(function executor(c) {
    //   getLeadListEffectCancelToken = c;
    // }),
  });
};

export const updateLeadEffect = (datas) => {
  getLeadListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));

  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leads-update",
    method: "post",
    data,
  });
};
export const deleteLeadEffect = (datas) => {
  getLeadListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));

  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leads-delete",
    method: "post",
    data,
  });
};

// export const verifyLeadMobileEffect = (datas) => {
//   getLeadListEffectCancelToken();
//   const data = caesarEncrypt(JSON.stringify(datas));
//   return leadInstance.request({
//     url: "/leads-mobileVerify",
//     method: "post",
//     data,
//   });
// };
export const verifyLeadMobileEffect = (datas) => {
  getLeadListEffectCancelToken();
  // const data = caesarEncrypt(JSON.stringify(datas));
  const data = JSON.stringify(datas);
  return leadInstance
    .request({
      url: "/leads-mobileVerify",
      method: "post",
      data,
    })
    .catch((error) => {
      return error?.response;
    });
};

export const showLeadEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/leads-show",
    method: "post",
    data,
  });
};

export const getLeadStageListEffect = () => {
  getLeadListEffectCancelToken();
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leadstage",
    method: "post",
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
    // cancelToken: new CancelToken(function executor(c) {
    //   getLeadListEffectCancelToken = c;
    // }),
  });
};
export const getLeadSourceListEffect = () => {
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leadsource",
    method: "post",
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
    // cancelToken: new CancelToken(function executor(c) {
    //   getLeadListEffectCancelToken = c;
    // }),
  });
};

export const createLeadActivityEffect = (datas) => {

  return leadInstance.request({
    url: "/activity-create",
    method: "post",
    data: datas,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createLeadNoteEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/notes-create",
    method: "post",
    data,
  });
};
export const createLeadScheduleEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/schedule-create",
    method: "post",
    data,
  });
};
export const updateLeadScheduleEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/schedule-update",
    method: "post",
    data,
  });
};
export const updateLeadActivityEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/activity-update",
    method: "post",
    data,
  });
};
export const getLeadNotesListEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/leads-notes",
    method: "post",
    data,
  });
};

export const getLeadMailListEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/leads-mail",
    method: "post",
    data,
  });
};
export const getLeadCallListEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/leads-call",
    method: "post",
    data,
  });
}
export const getLeadMeetingListEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/leads-direct",
    method: "post",
    data,
  });
}
export const getLeadDirectListEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/leads-direct",
    method: "post",
    data,
  });
}
export const leadCloseEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/leads-close",
    method: "post",
    data,
  });
};
// export const quickUpdateLeadEffect = (datas) => {
//   getLeadListEffectCancelToken();
//   const data = caesarEncrypt(JSON.stringify(datas));

//   const token = getUserLocalStorage();
//   return leadInstance.request({
//     url: "/leads-quickedit",
//     method: "post",
//     data,
//   });
// };
export const quickUpdateLeadEffect = (datas) => {
  getLeadListEffectCancelToken();
  const data = JSON.stringify(datas);
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leads-quickedit",
    method: "post",
    data,
  });
};
export const LeadRescheduleEffect = (datas) => {
  getLeadListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));

  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/schedule-update",
    method: "post",
    data,
  });
};
export const LeadTransferEffect = (datas) => {
  getLeadListEffectCancelToken();
  const data = (JSON.stringify(datas));

  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leads-transfer",
    method: "post",
    data,
  });
};
export const LeadReferenceEffect = (datas) => {
  getLeadListEffectCancelToken();
  const data = (JSON.stringify(datas));

  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leads-referencedetails",
    method: "post",
    data,
  });
};
export const LeadProductEffect = (datas) => {
  getLeadListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));

  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leads-productdetails",
    method: "post",
    data,
  });
};
export const LeadReopenEffect = (datas) => {
  getLeadListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));

  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leads-reopen",
    method: "post",
    data,
  });
};
export const LeadHistoryUpdate = (datas) => {
  getLeadListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));

  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leadfollowup-update",
    method: "post",
    data,
  });
};

export const getleadTypeListEffect = () => {

  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leadtype",
    method: "post",
  });
};
export const getAllLeadListEffect = (datas) => {

  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leadlist",
    method: "post",
  });
};

export const activityQuotationAdd = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/quo-store",
    method: "post",
    data
  });
}

export const crmDashboard = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/crm-dashboard",
    method: "post",
    data
  });
}
export const getUnitEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/unit_master",
    method: "get",
    data
  });
}
export const getleadPropertyTypeListEffect = () => {

  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leadpropertytype",
    method: "post",
  });
};

export const getFabricatorListEffect = () => {
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leadfabricator-list",
    method: "post",
  });
};

export const fabricatorDetails = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/leadfabricator-create",
    method: "post",
    data
  });
}


export const referenceDetails = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/reference-create",
    method: "post",
    data
  });
}
export const getReferenceList = (datas, referenceType) => {
  
  let data;
  
  if (datas) {
    data = caesarEncrypt(JSON.stringify(datas));
  }

  return leadInstance.request({
    url: `/reference?reference_type=${referenceType}`,
    method: "get",
    data,
  });
};
export const UpdateReferenceEffect = (datas) => {
  getLeadListEffectCancelToken();
  const data = caesarEncrypt(JSON.stringify(datas));

  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/reference-update",
    method: "post",
    data,
  });
};


export const getCustomerTypeListEffect = () => {
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/customertype",
    method: "post",
  });
};
export const assignTaskEffect = async(data) => {
  
  try {
    const token = getUserLocalStorage();
    const response = await leadInstance.request({
      url: "/inventorymaster-detailstransaction",
      method: "post",
      data: data,
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return response;
  } catch (error) {
    return handleError(error, "getTransactionEffect");
  }
}



export const leadReportEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/leadreport",
    method: "post",
    data
  });
}
export const getLeadCategoryListEffect = () => {
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/leadcategory",
    method: "post",
  });
};


export const getComplaintCategoryListEffect = () => {
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/complaintcategory",
    method: "post",
  });
}
export const complaintCloseEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/complaint-close",
    method: "post",
    data,
  });
};
export const complaintReopenEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/complaint-reopen",
    method: "post",
    data,
  });
};
export const getComplaintListEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/complaint-list",
    method: "post",
    data,
  });
}
export const createCompSolutionEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/solution-create",
    method: "post",
    data,
  });
};
export const createComplaintEffect = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/complaint-create",
    method: "post",
    data,
  });
};
export const getBranchTransferListEffect = (datas) => {
  const data = JSON.stringify(datas);
  return leadInstance.request({
    url: "/leads-branchtransfer-list",
    method: "post",
    data,
  });
};
export const addleadbranchtransfer = (datas) => {
  const data = (JSON.stringify(datas));
  return leadInstance.request({
    url: "/leads-branchtransfer",
    method: "post",
    data,
  });
}
export const getBranchListEffect = () => {
  const token = getUserLocalStorage();
  return leadInstance.request({
    url: "/branchlist",
    method: "post",
   data: {},
  });  }                     

export const getMissedCallListEffect = (datas) => {
  const data = caesarEncrypt(JSON.stringify(datas));
  return leadInstance.request({
    url: "/missedcall-list",
    method: "post",
    data,
  });
}