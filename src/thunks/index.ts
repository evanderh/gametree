import { createAsyncThunk } from "@reduxjs/toolkit";
import { DEFAULT_POSITION, Move } from "chess.js";
import { GotoGameMove, GotoGamePath, MakeGameMove } from "../redux/gameSlice";
import { UpdateFen } from "../redux/engineSlice";
import { AppDispatch, RootState } from "../store";

export const MakeMove = createAsyncThunk(
  'MakeMove',
  async (move: Move, { dispatch }) => {
    dispatch(MakeGameMove(move));
    dispatch(UpdateFen(move.after));
  }
);

export const GotoMove = createAsyncThunk<
  void, number, { dispatch: AppDispatch, state: RootState }
>(
  'GotoMove',
  async (key, { dispatch, getState }) => {
    const state: RootState = getState();
    const fen = state.game.moveTree[key].move?.after || DEFAULT_POSITION;
    dispatch(GotoGameMove(key));
    dispatch(UpdateFen(fen));
  }
);

export const GotoPath = createAsyncThunk<
  void, Move[], { dispatch: AppDispatch, state: RootState }
>(
  'GotoPath',
  async (moves, { dispatch }) => {
    const fen = moves.at(-1)?.after || DEFAULT_POSITION;
    dispatch(GotoGamePath(moves));
    dispatch(UpdateFen(fen));
  }
);
