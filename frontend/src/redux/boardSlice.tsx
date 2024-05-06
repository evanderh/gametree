import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DEFAULT_POSITION, Square } from 'chess.js';
import * as cg from 'chessground/types';
import { GOTO_MOVE, GOTO_PATH, MAKE_MOVE } from "./gameSlice";
import { openingsApi } from './openingsApi';

interface BoardSlice {
  fen: string,
  promotionTarget: Square[] | null,
  orientation: cg.Color,
}

const initialState: BoardSlice = {
  fen: DEFAULT_POSITION,
  promotionTarget: null,
  orientation: 'white',
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    SET_PROMOTION_TARGET(state, action: PayloadAction<Square[] | null>) {
      state.promotionTarget = action.payload;
    },
    FLIP_ORIENTATION(state) {
      state.orientation = state.orientation === 'white' ? 'black' : 'white';
    },
  },
  extraReducers(builder) {
    builder.addCase(MAKE_MOVE, (state, action) => {
      state.fen = action.payload.after;
      state.promotionTarget = null;
    });
    builder.addCase(GOTO_MOVE, (state, action) => {
      state.fen = action.payload.fen;
      state.promotionTarget = null;
    });
    builder.addCase(GOTO_PATH, (state, action) => {
      state.fen = action.payload.at(-1)?.after || DEFAULT_POSITION;
      state.promotionTarget = null;
    });
  },
});

export const { SET_PROMOTION_TARGET, FLIP_ORIENTATION } = boardSlice.actions;
export default boardSlice.reducer;
