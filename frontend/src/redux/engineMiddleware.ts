import { Middleware } from 'redux';
import { restartWorker, worker, write } from '../worker';
import { RootState } from '../store';
import { DEFAULT_POSITION } from 'chess.js';

export const setOption = (name: string, value: string | number) =>
  `setoption name ${name} value ${value}`;
export const setPos = (fen: string) => `position fen ${fen}`;

export const createEngineMiddleware = (): Middleware => {

  const updateEngine = (cmd: string, state: RootState) => {
    if (state.engine.running) {
      write('stop');
    }
    write(cmd);
    if (state.engine.running) {
      write('go infinite');
    }
  }

  return (store) => (next) => (action: any) => {
    const state = store.getState();

    if (action.type === 'engine/UCI_ENGINE_ERROR') {
      if (action.payload.includes('OOM')) {
        worker.terminate();
        restartWorker({ ...state.engine, threads: state.engine.threads / 2 });
      }
    }

    if (action.type === 'engine/TOGGLE_ENGINE') {
      write(state.engine.running ? 'stop' : 'go infinite');
    }

    if (action.type === 'engine/SET_HASH') {
      updateEngine(setOption('Hash', action.payload), state);
    }

    if (action.type === 'engine/SET_THREADS') {
      updateEngine(setOption('Threads', action.payload), state);
    }

    if (action.type === 'engine/SET_LINES') {
      updateEngine(setOption('MultiPV', action.payload), state);
    }

    if (action.type === 'game/MAKE_MOVE') {
      updateEngine(setPos(action.payload.after), state);
    }

    if (action.type === 'game/GOTO_MOVE') {
      updateEngine(setPos(action.payload.fen), state);
    }

    if (action.type === 'game/GOTO_PATH') {
      const fen = action.payload.at(-1)?.after || DEFAULT_POSITION;
      updateEngine(setPos(fen), state);
    }

    if (action.type === 'tree/SET_SOURCE') {
      updateEngine(setPos(DEFAULT_POSITION), state);
    }

    return next(action);
  };
};
