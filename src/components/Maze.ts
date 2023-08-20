import { Graphics, ViewSettings } from "./Graphics";
import { Cell } from "./Cell";

import { MazeSolver } from "../maze-solver/pkg";

export class Maze {
  private cells: Cell[][];
  private solver: MazeSolver;
  constructor(
    private rowCount: number,
    private columnCount: number,
    public vs: ViewSettings,
    public graphics: Graphics | null
  ) {
    this.cells = [];
    this.solver = new MazeSolver(
      this.vs.height,
      this.vs.width,
      this.rowCount,
      this.columnCount
    );
  }

  public async generateCells(): Promise<void> {
    if (!this.graphics) return;
    for (let i = 0; i < this.rowCount; i++) {
      const cells: Cell[] = [];
      for (let j = 0; j < this.columnCount; j++) {
        const cell = new Cell(
          this.solver.get_cell(i, j, 0),
          this.solver.get_cell(i, j, 1),
          this.solver.get_cell(i, j, 2),
          this.solver.get_cell(i, j, 3),
          this.graphics
        );
        await cell.draw();
        cells.push(cell);
        this.solver.set_cell(i, j, cell);
      }
      this.cells.push(cells);
    }
  }

  public async breakEntranceAndExit(): Promise<void> {
    if (!this.graphics) return;
    await this.solver.break_entrance_and_exit();
  }

  public async breakWalls(): Promise<void> {
    if (!this.graphics) return;
    await this.solver.break_walls();
  }

  public async resetVisited(): Promise<void> {
    if (!this.graphics) return;
    this.solver.reset_visited();
  }

  public async solve(): Promise<void> {
    if (!this.graphics) return;
    await this.solver.solve();
  }
}
