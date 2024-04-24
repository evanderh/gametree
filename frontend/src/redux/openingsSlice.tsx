import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';

export interface ECO {
  [moveSeq: string]: {
    name: string,
    code: string,
  }
}

export interface OpeningsState {
  openings: ECO,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
}

export const fetchOpenings = createAsyncThunk<ECO, string, { rejectValue: string }>(
  'openings/fetchOpenings',
  async (url, thunkAPI) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network request failed');
      }
      const data: ECO = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('An unknown error occurred');
    }
  }
);

const initialState: OpeningsState = {
  openings: {},
  status: 'idle',
}

const openingsSlice = createSlice({
  name: 'openings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpenings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOpenings.fulfilled, (state, action) => {
        state.openings = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchOpenings.rejected, (state, action) => {
        state.status = 'failed';
        console.error(action.payload);
      });
  }
});

export default openingsSlice.reducer;
