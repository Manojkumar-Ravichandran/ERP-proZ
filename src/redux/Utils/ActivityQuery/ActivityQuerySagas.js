import axios from "axios";
import { ExpireTokenInterceptor, SetTokenInterceptor } from "../../Interceptors";
import { caesarEncrypt } from "../../../utils/enc_dec";
import { takeLatest, call, put } from "redux-saga/effects";
import { ActivityQuerySuccess, ActivityQueryFailure } from "./ActivityQueryAction";
import { ACTIVITYQUERY_CREATE, ACTIVITYQUERY_UPDATE, ACTIVITYQUERY_ADD, ACTIVITYQUERY_FETCH, ACTIVITYQUERY_DELETE,ACTIVITYQUERYQUESTION_FETCH } from "./ActivityQueryTypes";

const ActivityQueryInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/crm`,
  headers: { "Content-Type": "application/json" },
});

ActivityQueryInstance.interceptors.request.use(SetTokenInterceptor, (error) =>
  Promise.reject(error)
);
ActivityQueryInstance.interceptors.response.use((res) => res, ExpireTokenInterceptor);


function* createActivityQuerySaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(ActivityQueryInstance.post, "/replyquery-create", encryptedData);
    yield put(ActivityQuerySuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(ActivityQueryFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
function* updateActivityQuerySaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload)); 
    const response = yield call(ActivityQueryInstance.post, "/replyquery-update", encryptedData);
    yield put(ActivityQuerySuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(ActivityQueryFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

function* fetchActivityQuerySaga(action) {
  try {
    const { page, per_page } = action.payload; 
    const params = { page, per_page }; 
    const response = yield call(ActivityQueryInstance.post, "/query-list", null, { params });
    if (response.data?.status === "success") {
      yield put(ActivityQuerySuccess({
        questionData: response.data.data || [], 
        questionPagination: {
          current_page: response.data.data?.current_page || 1,
          last_page: response.data.data?.last_page || 1,
          total: response.data.data?.total || 0,
        }
      }));
    } else {
      yield put(ActivityQueryFailure("Failed to fetch inventory data"));
    }
  } catch (error) {
    console.error("Error fetching inventory ActivityQuery: ", error);  // Debugging log
    yield put(ActivityQueryFailure(error?.message || "Failed to fetch inventory ActivityQuery."));
  }
}

function* deleteActivityQuerySaga(action) {
  try {
    const encryptedData = (JSON.stringify(action.payload));
    const response = yield call(ActivityQueryInstance.post, "/activityquery-delete", encryptedData);
    yield put(ActivityQuerySuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(ActivityQueryFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}
function* fetchActivityQuestionQuerySaga(action) {
  try {
    const { page, per_page } = action.payload;
    const params = { page, per_page };
    const response = yield call(ActivityQueryInstance.post, "/reply-list", null, { params });
    if (response.data?.status === "success") {
      yield put(
        ActivityQuerySuccess({
          replyData: response.data.data || [],
          replyPagination: {
            current_page: response.data?.data?.current_page || 1,
            last_page: response.data?.data?.last_page || 1,
            total: response.data?.data?.total || 0,
          },
        })
      );
    } else {
      yield put(ActivityQueryFailure("Failed to fetch reply data"));
    }
  } catch (error) {
    console.error("Error fetching reply data: ", error); // Debugging log
    yield put(ActivityQueryFailure(error?.message || "Failed to fetch reply data."));
  }
}
function* addActivityReplaySaga(action) {
  try {
    const encryptedData = caesarEncrypt(JSON.stringify(action.payload));
    const response = yield call(ActivityQueryInstance.post, "/reply-create", encryptedData);
    yield put(ActivityQuerySuccess(response.data));

    if (action.payload.callback) {
      action.payload.callback({ success: true, data: response.data });
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message;
    yield put(ActivityQueryFailure(errorMessage));
    if (action.payload.callback) {
      action.payload.callback({ success: false, error: errorMessage });
    }
  }
}

export default function* ActivityQuerySagas() {
  yield takeLatest(ACTIVITYQUERY_CREATE, createActivityQuerySaga);
  yield takeLatest(ACTIVITYQUERY_ADD, addActivityReplaySaga);
  yield takeLatest(ACTIVITYQUERY_UPDATE, updateActivityQuerySaga);
  yield takeLatest(ACTIVITYQUERY_FETCH, fetchActivityQuerySaga);
  yield takeLatest(ACTIVITYQUERY_DELETE, deleteActivityQuerySaga); 
  yield takeLatest(ACTIVITYQUERYQUESTION_FETCH, fetchActivityQuestionQuerySaga);

}
