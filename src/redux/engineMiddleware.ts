import { Middleware } from 'redux';
import { restartWorker, worker, write } from '../worker';
import { RootState } from '../store';
import { DEFAULT_POSITION } from 'chess.js';
import { UCI_ENGINE_ERROR, TOGGLE_ENGINE, SET_HASH, SET_THREADS, SET_LINES, EngineAction } from './engineSlice';
import { GameAction, GOTO_MOVE, GOTO_PATH, MakeGameMove } from './gameSlice';
import { SET_SOURCE, TreeAction } from './treeSlice';

export const setOption = (name: string, value: string | number) =>
  `setoption name ${name} value ${value}`;
export const setPos = (fen: string) => `position fen ${fen}`;
type WorkerAction = EngineAction | GameAction | TreeAction;

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

  return (store) => (next) => (action) => {
    const state = store.getState();

    if (action) {
        const workerAction = action as WorkerAction;
        switch (workerAction.type) {
        case UCI_ENGINE_ERROR.type:
            if (workerAction.payload.includes('OOM')) {
            worker.terminate();
            restartWorker({ ...state.engine, threads: state.engine.threads / 2 });
            }
            break;
        case TOGGLE_ENGINE.type:
            write(state.engine.running ? 'stop' : 'go infinite');
            break;
        case SET_HASH.type:
            updateEngine(setOption('Hash', workerAction.payload), state);
            break;
        case SET_THREADS.type:
            updateEngine(setOption('Threads', workerAction.payload), state);
            break;
        case SET_LINES.type:
            updateEngine(setOption('MultiPV', workerAction.payload), state);
            break;
        case MakeGameMove.type:
            updateEngine(setPos(workerAction.payload.after), state);
            break;
        case GOTO_MOVE.type:
            updateEngine(setPos(workerAction.payload.fen), state);
            break;
        case GOTO_PATH.type:
            updateEngine(setPos(workerAction.payload.at(-1)?.after || DEFAULT_POSITION), state);
            break;
        case SET_SOURCE.type:
            updateEngine(setPos(DEFAULT_POSITION), state);
            break;
        default:
            break;
        }
        return next(action);
    }
  };
};
