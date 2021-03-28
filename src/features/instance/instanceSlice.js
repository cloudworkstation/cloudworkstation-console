import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import getApiEndpoint from "../api/endpoint";

export const fetchAll = createAsyncThunk(
  'instance/fetchAll',
  async (thunkAPI) => {
    const response = await axios.get(getApiEndpoint() + "/instance");
    console.log("got following response", response.data);
    var instances = [];
    for (const key in response.data) {
      var value = response.data[key];
      value["id"] = key;
      console.log("instance data", value);
      instances.push(value);
    }
    return instances;
  }
)

export const createInstance = createAsyncThunk(
  'instance/create',
  async (item, thunkAPI) => {
    const response = await axios.post(getApiEndpoint() + "/instance", {
      action: "create",
      screen_geometry: item.screen_geometry,
      machine_def_id: item.machine_def_id
    });
    return {
      id: response.data.desktop_id,
      dns: "",
      instanceid: "",
      launchtime: "",
      machine_def_id: item.machine_def_id,
      screengeometry: item.screen_geometry,
      state: "",
      pending_action: "creating"
    }
  }
)

export const deleteInstance = createAsyncThunk(
  'instance/delete',
  async (item, thunkAPI) => {
    const response = await axios.delete(getApiEndpoint() + "/instance/" + item.id);
    return {
      id: item.id,
      //status: "okay"
      status: response.data.status
    }
  }
)

export const stopInstance = createAsyncThunk(
  'instance/stop',
  async (item, thunkAPI) => {
    const response = await axios.patch(getApiEndpoint() + "/instance/" + item.id, {
      state: "stopped"
    });
    return {
      id: item.id,
      //status: "okay"
      status: response.data.status
    }
  }
)

export const startInstance = createAsyncThunk(
  'instance/start',
  async (item, thunkAPI) => {
    const response = await axios.patch(getApiEndpoint() + "/instance/" + item.id, {
      state: "running"
    });
    return {
      id: item.id,
      //status: "okay"
      status: response.data.status
    }
  }
)

const instanceSlice = createSlice({
  name: 'instance',
  initialState: { 
    instances: [], 
    loading: 'idle', 
    error: '',
    order: 'asc',
    orderBy: 'name',
    selected: [],
    page: 0,
    rowsPerPage: 10,
    openNewDesktopForm: false
  },
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setOrderBy: (state, action) => {
      state.orderBy = action.payload
    },
    setSelected: (state, action) => {
      state.selected = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setRowsPerPage: (state, action) => {
      state.rowsPerPage = action.payload
    },
    setOpenNewDesktopForm: (state, action) => {
      state.openNewDesktopForm = action.payload
    },
    setDesktopState: (state, action) => {
      state.instances = state.instances.map((instance) => {
        if(instance.id === action.payload.id) {
          return {
            ...instance,
            ...{pending_action: "",
                state: action.payload.state}
          }
        } else {
          return instance;
        }
      })
    }
  },
  extraReducers: {
    [fetchAll.fulfilled]: (state, action) => {
      state.loading = "idle";
      state.error = "";
      state.instances = action.payload;
    },
    [fetchAll.pending]: state => {
      state.loading = "yes";
    },
    [fetchAll.rejected]: (state, action) => {
      state.loading = "idle";
      console.log(action.error.message);
      state.error = action.error.message;
    },

    [createInstance.fulfilled]: (state, action) => {
      state.instances.push(action.payload);
    },
    [createInstance.rejected]: (state, action) => {
      console.log(action.error.message);
      state.error = action.error.message;
    },

    [deleteInstance.fulfilled]: (state, action) => {
      console.log("updating pending state for instance with id", action.payload.id);
      state.instances = state.instances.map((instance) => {
        if(instance.id === action.payload.id) {
          return {
            ...instance,
            ...{pending_action: "Terminating"}
          }
        } else {
          return instance;
        }
      })
    },
    [deleteInstance.rejected]: (state, action) => {
      console.log(action.error.message);
      state.error = action.error.message;
    },

    [stopInstance.fulfilled]: (state, action) => {
      console.log("updating pending state for instance with id", action.payload.id);
      state.instances = state.instances.map((instance) => {
        if(instance.id === action.payload.id) {
          return {
            ...instance,
            ...{pending_action: "Stopping"}
          }
        } else {
          return instance;
        }
      })
    },
    [stopInstance.rejected]: (state, action) => {
      console.log(action.error.message);
      state.error = action.error.message;
    },

    [startInstance.fulfilled]: (state, action) => {
      console.log("updating pending state for instance with id", action.payload.id);
      state.instances = state.instances.map((instance) => {
        if(instance.id === action.payload.id) {
          return {
            ...instance,
            ...{pending_action: "Starting"}
          }
        } else {
          return instance;
        }
      })
    },
    [startInstance.rejected]: (state, action) => {
      console.log(action.error.message);
      state.error = action.error.message;
    },
  }
})

export const { setOrder, setOrderBy, setSelected, setPage, setRowsPerPage, setOpenNewDesktopForm, setDesktopState } = instanceSlice.actions;

export const selectOrder = state => state.instance.order;
export const selectOrderBy = state => state.instance.orderBy;
export const selectSelected = state => state.instance.selected;
export const selectPage = state => state.instance.page;
export const selectRowsPerPage = state => state.instance.rowsPerPage;
export const selectLoading = state => state.instance.loading;
export const selectInstances = state => state.instance.instances;
export const selectOpenNewDesktopForm = state => state.instance.openNewDesktopForm;

export default instanceSlice.reducer;