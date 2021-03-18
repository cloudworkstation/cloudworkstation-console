import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { FormGroup, FormHelperText } from '@material-ui/core';

import {
  createInstance,
  selectOpenNewDesktopForm,
  setOpenNewDesktopForm
} from './instanceSlice';

import {
  selectEntitlements,
} from './../entitlement/entitlementSlice';

import { useSelector, useDispatch } from 'react-redux';


export default function CreateNewInstance(props) {
  const dispatch = useDispatch();

  const [ machineDef, setMachineDef ] = useState("");
  const [ machineDefError, setMachineDefError] = useState("");
  const [ screenGeometry, setScreenGeometry] = useState("1920x1080");
  const [ screenGeometryError, setScreenGeometryError] = useState("");

  const open = useSelector(selectOpenNewDesktopForm);
  const entitlements = useSelector(selectEntitlements);

  useEffect(() => {
      if(entitlements.length > 0) {
        setMachineDef(entitlements[0].machine_def_id);
      }

  }, [entitlements, setMachineDef]);

  const callCreateInstance = function() {
    if(machineDef === "") {
      setMachineDefError("Machine type must be set");
    } else {
      if(screenGeometry === "") {
        setScreenGeometryError("Screen geometry must be set");
      } else {
        dispatch(createInstance({
          machine_def_id: machineDef,
          screen_geometry: screenGeometry
        }));
        dispatch(setOpenNewDesktopForm(false));
      }
    }
  }

  const handleMachineDefChange = (event) => {
    setMachineDef(event.target.value);
  }

  const handleScreenGeometryChange = (event) => {
    setScreenGeometry(event.target.value);
  }

  const entitlementFilter = entitlement => {
    return entitlement.current_instances < entitlement.total_allowed_instances;
  }

  return (
    <div>
      <Dialog fullWidth={true} maxWidth="md" open={open} onClose={() => {}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Launch New Desktop</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Details of the new desktop instance to start
          </DialogContentText>
          <FormGroup>
            <FormControl>
              <InputLabel id="def-select-label">Machine definition</InputLabel>
              <Select
                labelId="def-select-label"
                id="def-select"
                value={machineDef}
                onChange={handleMachineDefChange}
                style={{maxWidth: "220px"}}
                error={!machineDefError === ""}
              >
                {entitlements && entitlements
                  .filter(entitlementFilter)
                  .map((row, index) => {
                  console.log("machine def", row.machine_def_id, row.machine_def_id === machineDef, "state", machineDef)
                  return(
                    <MenuItem selected={row.machine_def_id === machineDef} key={row.machine_def_id} value={row.machine_def_id}>{row.machine_def_id}</MenuItem>
                  )
                })}
              </Select>
              <FormHelperText>{machineDefError}</FormHelperText>
            </FormControl>
          </FormGroup>
          <FormGroup>
            <FormControl>
              <InputLabel id="sg-select-label">Screen Geometry</InputLabel>
              <Select
                labelId="sg-select-label"
                id="sg-select"
                value={screenGeometry}
                onChange={handleScreenGeometryChange}
                style={{maxWidth: "220px"}}
                error={!screenGeometryError === ""}
              >
                <MenuItem value="1920x1080">1920x1080</MenuItem>
                <MenuItem value="1280x720">1280x720</MenuItem>
              </Select>
              <FormHelperText>{screenGeometryError}</FormHelperText>
            </FormControl>
          </FormGroup>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {dispatch(setOpenNewDesktopForm(false))}} color="primary">
            Close
          </Button>
          <Button onClick={callCreateInstance} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}