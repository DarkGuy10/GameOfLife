/** Possible states of a cell */
export enum CellState {
  Dead,
  Alive,
}

/** Possible causes of death */
export enum CauseOfDeath {
  Underpopulation,
  Overpopulation,
}

/** Possible causes of resurrection */
export enum CauseOfResurrection {
  Reproduction,
  SixGenTimout,
  Random,
}

export type StateUpdatePayload = {
  newState: CellState.Alive;
  cause: CauseOfResurrection;
} | { newState: CellState.Dead; cause: CauseOfDeath };
