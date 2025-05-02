import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLeadDetailInprogress } from '../../../../../redux/CRM/lead/LeadActions';

export function DetailsCall({ uuid }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (uuid) {
      const payload ={uuid}
      dispatch(setLeadDetailInprogress({ ...payload }));
    }
  }, [dispatch, uuid]);

  return null; // Render nothing, as it seems to just trigger an action
}
