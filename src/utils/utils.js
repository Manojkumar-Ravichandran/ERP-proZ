import { caesarDecrypt, caesarEncrypt } from "./enc_dec";

export const getErrorMessageFromAPI = ({ response }, customMessage = false) => {
  if (response?.data?.message) {
    return response?.data?.message;
  } else {
    return response?.data?.error
      ? response?.data
      : customMessage
      ? customMessage
      : false;
  }
};

export const setUserLocalStorage = ({ bearer_token, ...rest }) => {
    localStorage.setItem("token", caesarEncrypt(bearer_token));
    localStorage.setItem("userInfo", caesarEncrypt(JSON.stringify(rest)));
    return true;
  };

  export const getUserLocalStorage = () => {
    let token,userInfo;
    if(localStorage.getItem("token")){
      token = caesarDecrypt(localStorage.getItem("token"));
    }
    
    if(localStorage.getItem("userInfo")){
      userInfo = caesarDecrypt(localStorage.getItem("userInfo"));
    }
 
    if (token && userInfo) {
      return { token, userInfo: JSON.parse(userInfo) };
    }
    return false;
  };

  export const RemoveUserLocalStorage = () => {
    let token,userInfo;
    if(localStorage.getItem("token")){
      localStorage.removeItem("token");

    }
    
    if(localStorage.getItem("userInfo")){
      localStorage.removeItem("userInfo");

    }
   
    // return false;
  };

export  function getRandom(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}