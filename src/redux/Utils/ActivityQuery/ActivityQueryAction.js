import {
  ACTIVITYQUERY_CREATE,
  ACTIVITYQUERY_UPDATE,
  ACTIVITYQUERY_FETCH,
  ACTIVITYQUERY_SUCCESS,
  ACTIVITYQUERY_FAILURE,
  ACTIVITYQUERY_DELETE,
  ACTIVITYQUERYQUESTION_FETCH,
  ACTIVITYQUERY_ADD
} from "./ActivityQueryTypes";

export const createActivityQuery = (data) => ({
  type: ACTIVITYQUERY_CREATE,
  payload: data,
});
export const addActivityReplay = (data) => ({
  type: ACTIVITYQUERY_ADD,
  payload: data,
});
export const updateActivityQuery = (data) => ({
  type: ACTIVITYQUERY_UPDATE,
  payload: data,
});

export const fetchActivityQuery = ({ page, per_page }) => ({
  type: ACTIVITYQUERY_FETCH,
  payload: { page, per_page },
});

export const fetchActivityQuestionQuery = ({ page, per_page }) => ({
  type: ACTIVITYQUERYQUESTION_FETCH,
  payload: { page, per_page },
})

export const ActivityQuerySuccess = (data) => ({
  type: ACTIVITYQUERY_SUCCESS,
  payload: data,
});

export const ActivityQueryFailure = (error) => ({
  type: ACTIVITYQUERY_FAILURE,
  payload: error,
});

export const deleteActivityQuery = (payload) => ({
  type: ACTIVITYQUERY_DELETE,
  payload,
});
