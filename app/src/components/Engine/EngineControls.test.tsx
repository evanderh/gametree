import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@testing-library/react";

import { MockDispatch, renderWithProviders } from "../../test/testUtils";
import EngineControls from "./EngineControls";
import { setupStore } from "../../store";
import { SET_HASH, SET_LINES, SET_THREADS } from "../../redux/engineSlice";

describe('EngineControls', () => {
  it('renders sf version', () => {
    const { getByText } = renderWithProviders(<EngineControls />);
    getByText(/Stockfish 16/);
  })

  it('dispatches set hash', () => {
    const mockStore = setupStore();
    mockStore.dispatch = vi.fn() as MockDispatch;
    const { getByTitle } = renderWithProviders(<EngineControls />, {
      store: mockStore,
    });
    const hash = getByTitle(/Hash/);
    fireEvent.change(hash, { target: { value: '1' } })
    expect(mockStore.dispatch).toHaveBeenCalledWith(SET_HASH(1))
  });

  it('dispatches set threads', () => {
    const mockStore = setupStore();
    mockStore.dispatch = vi.fn() as MockDispatch;
    const { getByTitle } = renderWithProviders(<EngineControls />, {
      store: mockStore,
    });
    const threads = getByTitle(/threads/);
    fireEvent.change(threads, { target: { value: '1' } })
    expect(mockStore.dispatch).toHaveBeenCalledWith(SET_THREADS(1))
  });
  
  it('dispatches set lines', () => {
    const mockStore = setupStore();
    mockStore.dispatch = vi.fn() as MockDispatch;
    const { getByTitle } = renderWithProviders(<EngineControls />, {
      store: mockStore,
    });
    const variations = getByTitle(/variations/);
    const input = variations.childNodes[1];
    fireEvent.change(input, { target: { value: '2' } })
    expect(mockStore.dispatch).toHaveBeenCalledWith(SET_LINES(2))
  });
});
