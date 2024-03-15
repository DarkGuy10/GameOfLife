import { Cell } from "./Cell.ts";
import {
  readKeypress,
} from "https://deno.land/x/keypress_modified@0.0.1/mod.ts";
import {
  DEFAULT_COLUMNS,
  DEFAULT_DELAY,
  DEFAULT_ROWS,
  HIDE_CURSOR_ANSII,
  SHOW_CURSOR_ANSII,
} from "./constants.ts";
import {
  CauseOfDeath,
  CauseOfResurrection,
  CellState,
  StateUpdatePayload,
} from "./Cell.ts";
import { randomFrom, sleep } from "./utils.ts";

/**
 * Represents an instance of the simulation of Conway's Game of Life
 * (with modified conditions)
 */
export class GameOfLife {
  private rows: number;
  private columns: number;
  private delay: number;
  private grid: Array<Cell>;
  private activeCellId: number;
  private generationTS: number;

  /**
   * Create a new instance of GameOfLife
   * @param rows Number of rows in the grid
   * @param columns Number of columns in the grid
   * @param delay Time delay between two generations
   */
  constructor(
    rows: number = DEFAULT_ROWS,
    columns: number = DEFAULT_COLUMNS,
    delay: number = DEFAULT_DELAY,
  ) {
    this.rows = rows;
    this.columns = columns;
    this.delay = delay;
    this.activeCellId = 0;
    this.generationTS = 0;

    // Initialize grid of cells
    this.grid = [];
    const totalCells = rows * columns;
    for (let i = 0; i < totalCells; i += 1) {
      this.grid.push(new Cell(i));
    }

    // Hide cursors during execution
    console.log(HIDE_CURSOR_ANSII);
  }

  /**
   * Get a cell from its row and column number
   * @param row Row number of cell
   * @param column Column number of cell
   * @returns Cell at [row, column]
   */
  getCellAt(row: number, column: number): Cell {
    return this.grid[row * this.columns + column];
  }

  /**
   * Print the entire cell grid with proper formatting
   *
   * Handles both pre-simulation and simulation stages
   */
  printBoard() {
    for (let i = 0; i < this.rows; i += 1) {
      const formatOptions: string[] = [];
      let output = (i % 2) ? " " : ""; // Append blank space
      output += this.grid.slice(i * this.columns, (i + 1) * this.columns).map(
        (cell) => {
          if (cell.id === this.activeCellId) {
            formatOptions.push("color: #f38ba8");
            formatOptions.push("color: unset");
            return cell.formattedUnicode;
          }

          /* uncomment to view neighbors of active cell in pre-simulation stage
          const neighborsOfSelected = this.getNeighbors(this.activeCellId);
          if (neighborsOfSelected.find((one) => one.id === cell.id)) {
            formatOptions.push("color: blue");
            formatOptions.push("color: unset");
            return cell.formattedUnicode;
          }
          */
          return cell.unicode;
        },
      ).join(" ");
      console.log(output, ...formatOptions);
    }
  }

  /**
   * Get the sum of two numbers modulo the totalCells in grid
   *
   * Use this for cell id arithmetic so that it does not bleed over
   * the limits
   */
  private moduloSum(a: number, b: number) {
    const totalCells = this.grid.length;
    return (a + b + totalCells) % totalCells;
  }

  /**
   * Find neighbors of a cell in the grid
   * @param target Target cell to find neighbors of
   * @returns Array of neighboring cells
   */
  getNeighborsOf(target: Cell): Cell[] {
    const neighbors: Cell[] = [];
    const { row, column } = this.getRowColumn(target.id);
    const atStartOfRow = !column;
    const atEndOfRow = column === this.columns - 1;
    const atStartOfColumn = !row;
    const atEndOfColumn = row === this.rows - 1;

    if (!atStartOfRow) {
      neighbors.push(this.getCellAt(row, column - 1));
    }

    if (!atEndOfRow) {
      neighbors.push(this.getCellAt(row, column + 1));
    }

    if (!atStartOfColumn) {
      neighbors.push(this.getCellAt(row - 1, column));
      if (row % 2) {
        if (!atEndOfRow) {
          neighbors.push(this.getCellAt(row - 1, column + 1));
        }
      } else {
        if (!atStartOfRow) {
          neighbors.push(this.getCellAt(row - 1, column - 1));
        }
      }
    }

    if (!atEndOfColumn) {
      neighbors.push(this.getCellAt(row + 1, column));
      if (row % 2) {
        if (!atEndOfRow) {
          neighbors.push(this.getCellAt(row + 1, column + 1));
        }
      } else {
        if (!atStartOfRow) {
          neighbors.push(this.getCellAt(row + 1, column - 1));
        }
      }
    }

    return neighbors;
  }

  /**
   * Get the row and column numbers of a cell from its id
   * @param id Id of cell
   * @returns `{row, column}` of the cell
   */
  private getRowColumn(id: number) {
    return {
      row: Math.floor(id / this.columns),
      column: id % this.columns,
    };
  }

  /** Show cursor before exit */
  private cleanup() {
    console.log(SHOW_CURSOR_ANSII);
  }

  /**
   * Listen for keypress inputs in pre-simulation stage
   *
   * [wasd => navigate, SPACE => toggle alive/dead, RETURN => start simulation]
   */
  async listen() {
    console.clear();
    console.log("Welcome to (modded) Conway's Game of Life!");
    console.log(
      "%c[wasd => navigate, SPACE => toggle alive/dead, RETURN => start simulation]\n",
      "color: #585b70",
    );
    this.printBoard();

    for await (const keypress of readKeypress()) {
      switch (keypress.key) {
        case "a":
          this.activeCellId = this.moduloSum(this.activeCellId, -1);
          break;
        case "d":
          this.activeCellId = this.moduloSum(this.activeCellId, 1);
          break;
        case "s":
          this.activeCellId = this.moduloSum(this.activeCellId, this.columns);
          break;
        case "w":
          this.activeCellId = this.moduloSum(this.activeCellId, -this.columns);
          break;
        case "space":
          this.grid[this.activeCellId].toggleState();
          break;
        case "return":
          this.activeCellId = -1;
          return;
      }

      // Ctrl + C exit signal
      if (keypress.ctrlKey && keypress.key === "c") {
        Deno.exit(0);
      }

      console.clear();
      console.log("Welcome to (modded) Conway's Game of Life!");
      console.log(
        "%c[wasd => navigate, SPACE => toggle alive/dead, RETURN => start simulation]\n",
        "color: #585b70",
      );
      this.printBoard();
    }
  }

  /**
   * Performs a single generation worth of changes
   *
   * @returns ExitFlag that determines if the simulation is over or not
   */
  private step() {
    console.clear();
    console.log("Welcome to (modded) Conway's Game of Life!");
    console.log(
      `%c[Generation timestamp: ${this.generationTS}]\n`,
      "color: #585b70",
    );
    this.printBoard();

    // Early return with ExitCode: true if the simulation is over
    if (
      !this.grid.filter((cell) =>
        cell.isDead &&
        (cell.deathTS
          ? cell.causeOfDeath === CauseOfDeath.Overpopulation
          : true)
      ).length
    ) {
      console.log(
        `\nAll cells achieved permanent immortality at generation [${this.generationTS}]`,
      );
      console.log(
        `%cThe game of life is over...`,
        "color: #585b70",
      );
      this.cleanup();
      return true;
    }

    // Prepare for next generation
    this.generationTS += 1;
    const updatePayloads: Array<StateUpdatePayload | null> = [];
    const randomDeadCell = randomFrom(this.grid.filter((cell) => cell.isDead));

    // Get payloads for next generation states
    for (const cell of this.grid) {
      const liveNeighbors = this.getNeighborsOf(cell).filter((cell) =>
        cell.isAlive
      );

      // 1. Any live cell with fewer than two live neighbors dies
      if (
        cell.isAlive && liveNeighbors.length < 2 &&
        cell.causeOfDeath !== CauseOfDeath.Underpopulation
      ) {
        updatePayloads.push(
          Cell.createPayload(CellState.Dead, CauseOfDeath.Underpopulation),
        );
      } // 2. Any live cell with two or three live neighbors lives
      else if (
        cell.isAlive &&
        (liveNeighbors.length === 2 || liveNeighbors.length === 3)
      ) {
        updatePayloads.push(null);
      } // 3. Any live cell with more than three live neighbors dies
      else if (
        cell.isAlive && liveNeighbors.length > 3 &&
        cell.causeOfDeath !== CauseOfDeath.Overpopulation
      ) {
        updatePayloads.push(
          Cell.createPayload(CellState.Dead, CauseOfDeath.Overpopulation),
        );
      } // 4. Any dead cell with exactly three live neighbors becomes a live cell
      else if (cell.isDead && liveNeighbors.length === 3) {
        updatePayloads.push(
          Cell.createPayload(CellState.Alive, CauseOfResurrection.Reproduction),
        );
      } // 5. Every dead cell resurrects after 6 generations irrespective of the number of live neighbors
      else if (
        cell.isDead && cell.deathTS && (this.generationTS - cell.deathTS === 6)
      ) {
        updatePayloads.push(
          Cell.createPayload(CellState.Alive, CauseOfResurrection.SixGenTimout),
        );
      } else {
        updatePayloads.push(null);
      }
    }

    // Apply all state updates
    updatePayloads.forEach((payload, index) =>
      payload &&
      this.grid[index].updateState(payload)
    );

    // 6. Every 4 generations a random dead cell comes to life irrespective of the number of live neighbors
    if (this.generationTS % 4 === 0) {
      randomDeadCell
        .updateState(
          Cell.createPayload(CellState.Alive, CauseOfResurrection.Random),
        );
    }

    // Return with ExitCode: false during normal execution
    return false;
  }

  /**
   * Start the Game of Life simulation
   */
  async simulate() {
    let exitFlag = false;
    do {
      // Sleep between each generation
      await sleep(this.delay);
      exitFlag = await this.step();
    } while (!exitFlag);
  }
}
