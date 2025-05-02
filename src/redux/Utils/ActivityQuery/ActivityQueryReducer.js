import {
  ACTIVITYQUERY_CREATE,
  ACTIVITYQUERY_UPDATE,
  ACTIVITYQUERY_FETCH,
  ACTIVITYQUERY_SUCCESS,
  ACTIVITYQUERY_FAILURE,
  ACTIVITYQUERY_DELETE,
  ACTIVITYQUERYQUESTION_FETCH,
  ACTIVITYQUERY_ADD,
} from "./ActivityQueryTypes";

const initialState = {
  replyData: [],
  questionData: [],
  replyPagination: { current_page: 1, last_page: 1, total: 0 },
  questionPagination: { current_page: 1, last_page: 1, total: 0 },
  error: null,
};

const ActivityQueryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIVITYQUERY_CREATE:
    case ACTIVITYQUERY_UPDATE:
    case ACTIVITYQUERY_DELETE:
    case ACTIVITYQUERY_FETCH:
      return { ...state };
    case ACTIVITYQUERYQUESTION_FETCH:
      return { ...state };
    case ACTIVITYQUERY_ADD:
    case ACTIVITYQUERY_SUCCESS:
      return {
        ...state,
        replyData: action.payload?.replyData || state.replyData,
        questionData: action.payload?.questionData || state.questionData,
        replyPagination: action.payload?.replyPagination || state.replyPagination,
        questionPagination: action.payload?.questionPagination || state.questionPagination,
      };


    case ACTIVITYQUERY_FAILURE:
      return {
        ...state,
        error: action.payload || "Failed to fetch data",
      };

    default:
      return state;
  }
};

export default ActivityQueryReducer;
