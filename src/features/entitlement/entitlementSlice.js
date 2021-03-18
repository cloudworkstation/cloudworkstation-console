import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";

var API_BASE = function() {
  if(window.location.hostname === "localhost") {
    return "http://localhost:5000/";
  } else {
    return "/"
  }
}

export const fetchAll = createAsyncThunk(
  'entitlement/fetchAll',
  async (thunkAPI) => {
    const response = await axios.get(API_BASE() + "api/entitlement");
    console.log("got following response", response.data);
    return response.data;
  }
)

const entitlementSlice = createSlice({
  name: 'entitlement',
  initialState: { 
    entitlements: [], 
    loading: 'idle', 
    loaded: 'no',
    error: '',
  },
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
    
  },
  extraReducers: {
    [fetchAll.fulfilled]: (state, action) => {
      state.loading = "idle";
      state.loaded = "yes";
      state.error = "";
      state.entitlements = action.payload;
    },
    [fetchAll.pending]: state => {
      state.loading = "yes";
      state.loaded = "no";
    },
    [fetchAll.rejected]: (state, action) => {
      state.loading = "idle";
      state.loaded = "no";
      state.entitlements = [];
      console.log(action.error.message);
      state.error = action.error.message;
    },
  }
})

//export const { setOrder, setOrderBy, setSelected, setPage, setRowsPerPage } = instanceSlice.actions;

export const selectLoading = state => state.entitlement.loading;
export const selectLoaded = state => state.entitlement.loaded;
export const selectEntitlements = state => state.entitlement.entitlements;

export default entitlementSlice.reducer;