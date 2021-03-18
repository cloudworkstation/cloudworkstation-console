import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import {
  setOpenNewDesktopForm
} from './instanceSlice';

import {
  fetchAll,
  selectLoaded,
  selectEntitlements
} from './../entitlement/entitlementSlice';

const fabStyle = {
  right: 20,
  bottom: 20,
  position: 'fixed'
};

function AddInstanceButton() {
  const dispatch = useDispatch();
  const entitlementLoaded = useSelector(selectLoaded);
  const entitlements = useSelector(selectEntitlements);

  const [loadPage] = useState(0);

  useEffect(() => {
    dispatch(fetchAll())
  }, [loadPage, dispatch]);

  const validEntitlement = function() {
    var valid = false;
    entitlements.forEach(e => {
      if(e.current_instances < e.total_allowed_instances) {
        valid = true;
      }
    });
    return valid;
  }

  const createNewInstance = function() {
    if(entitlementLoaded === "yes") {
      console.log("entitlements loaded", entitlements);
      if(validEntitlement()) {
        console.log("there's a valid entitlement");
        dispatch(setOpenNewDesktopForm(true));
      }
    }
  }

  return (
    <Fab color="primary" aria-label="add" style={fabStyle} onClick={createNewInstance}>
      <AddIcon />
    </Fab>
  )
}

export default AddInstanceButton;