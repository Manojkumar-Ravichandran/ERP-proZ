// import { tokenLoader } from "../utils/auth";
import { caesarEncrypt } from "../utils/encryption";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const appKey = process.env.REACT_APP_API_KEY;

function createHeaders(token = null) {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": appKey,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function makeRequest(url, data = null, method = "POST", token = null, encrypt = true) {
  const headers = createHeaders(token);
  const payload = encrypt && data ? `"${caesarEncrypt(JSON.stringify(data))}"` : data;

  try {
    const response = await fetch(`${backendUrl}${url}`, {
      method,
      headers,
      body: method === "POST" ? payload : data,
    });
    const result = await response.json();
    return { response, result };
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
}

export function postCall(url, data, encrypt = true) {
  return makeRequest(url, data, "POST", null, encrypt);
}

export function LoggedpostCall(url, data, encrypt = true) {
//   const token = tokenLoader();
    const token = null;

  return makeRequest(url, data, "POST", token, encrypt);
}

export function getCall(url,body) {
//   const token = tokenLoader();
  const token = null;

  return makeRequest(url, body, "GET", token, false);
}
