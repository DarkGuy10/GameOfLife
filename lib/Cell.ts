import {
  CauseOfDeath,
  CauseOfResurrection,
  CellState,
  StateUpdatePayload,
} from "./typings.ts";

/**
 * Represents a single cell in the game of life
 *
 * A cell only stores data about itself and is ignorant
 * of its neighbors.
 */
export class Cell {
  /** Current state of this cell*/
  state: CellState;

  /** Id of this cell */
  id: number;

  /** Cause of previous death */
  causeOfDeath?: CauseOfDeath;

  /** Cause of previous resurrection */
  causeOfResurrection?: CauseOfResurrection;

  /** Timestamp of previous death */
  deathTS?: number;

  /**
   * Create a new cell
   * @param id Id of this cell
   */
  constructor(id: number) {
    this.state = CellState.Dead;
    this.id = id;
  }

  /** Printable unicode depending on state*/
  get unicode(): string {
    switch (this.state) {
      case CellState.Alive:
        return "⬢";
      case CellState.Dead:
        return "⬡";
      default:
        return "?";
    }
  }

  /** Formatted unicode */
  get formattedUnicode(): string {
    return `%c${this.unicode}%c`;
  }

  /** Toggle state of this cell between 'Alive' and 'Dead' */
  toggleState() {
    this.state = this.isAlive ? CellState.Dead : CellState.Alive;
  }

  /**
   * Create a payload that can be passed to `Cell#updateState` with proper props
   * @param newState New cell state
   * @param cause Cause for update
   * @returns Payload that can be passed to `Cell#updateState`
   */
  static createPayload<T extends CellState>(
    newState: T,
    cause: T extends CellState.Alive ? CauseOfResurrection : CauseOfDeath,
  ): StateUpdatePayload {
    return { newState, cause } as StateUpdatePayload;
  }

  /**
   * Update cell-state with cause
   *
   * Use static `Cell#createPayload` to form a proper payload
   * @param updatePayload Payload for this state update
   */
  updateState(updatePayload: StateUpdatePayload) {
    const { newState, cause } = updatePayload;
    this.state = newState;
    if (newState === CellState.Dead) {
      this.causeOfDeath = cause;
    } else {
      this.causeOfResurrection = cause;
    }
  }

  /** Is this cell alive */
  get isAlive() {
    return this.state === CellState.Alive;
  }

  /** Is this cell dead */
  get isDead() {
    return this.state === CellState.Dead;
  }
}
