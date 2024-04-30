import { useDispatch, useSelector } from "react-redux";

import { SET_HASH, SET_LINES, SET_THREADS } from "../redux/engineSlice";
import { AppDispatch, RootState } from '../store';

const EngineControls = () => {
  const nnue = useSelector((state: RootState) => state.engine.nnue);
  const hash = useSelector((state: RootState) => state.engine.hash);
  const threads = useSelector((state: RootState) => state.engine.threads);
  const lines = useSelector((state: RootState) => state.engine.lines);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex items-center text-xs p-1 gap-1 border-t border-gray-400 dark:border-gray-600 gray-gradient-to-b">
      <select
        title="Hash size"
        className="btn-primary"
        onChange={(e) => dispatch(SET_HASH(+e.target.value))}
        value={hash}
      >
        <option value="1">1MB</option>
        <option value="2">2MB</option>
        <option value="4">4MB</option>
        <option value="8">8MB</option>
        <option value="16">16MB</option>
        <option value="32">32MB</option>
      </select>
      <select
        title="# of threads"
        className="btn-primary"
        onChange={(e) => dispatch(SET_THREADS(+e.target.value))}
        value={threads}
      >
        <option value="1">1 CPU</option>
        <option value="2">2 CPU</option>
        <option value="4">4 CPU</option>
        <option value="8">8 CPU</option>
        <option value="16">16 CPU</option>
      </select>
      <div className="btn-primary py-0" title="# of engine variations">
        <label className="overflow-hidden whitespace-nowrap" htmlFor="lines">Lines: </label>
        <input
          id="lines" type="number"
          min={1} max={99}
          className="bg-transparent pl-1 py-1 w-8"
          onChange={(e) => dispatch(SET_LINES(+e.target.value))}
          value={lines}
        />
      </div>
      <div className="flex flex-col text-xs leading-none overflow-hidden whitespace-nowrap	">
        <div>
          <span>Stockfish 16</span>
          {
            nnue &&
            <span className="text-green-700"> NNUE</span>
          }
        </div>
        <p>in local browser</p>
      </div>
    </div>
  );
}

export default EngineControls;
