import { Graphics, ViewSettings } from "./Graphics";
import { Cell } from "./Cell";

export class Maze {
  public cells: Cell[][];
  constructor(
    private rowCount: number,
    private columnCount: number,
    public vs: ViewSettings,
    public graphics: Graphics | null
  ) {
    this.cells = [];
    this.generateCells();
  }

  private generateCells(): void {
    const x = this.vs.width / this.columnCount;
    const y = this.vs.height / this.rowCount;
    for (let i = 0; i < this.columnCount; i++) {
      const cells: Cell[] = [];
      for (let j = 0; j < this.rowCount; j++) {
        const cell = new Cell(
          i * x,
          j * y,
          (i + 1) * x,
          (j + 1) * y,
          this.graphics
        );
        cells.push(cell);
      }
      this.cells.push(cells);
    }
  }

  public async animate(): Promise<void> {
    if (!this.graphics) return;
    for (let i = 0; i < this.columnCount; i++) {
      for (let j = 0; j < this.rowCount; j++) {
        this.cells[i][j].draw();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await new Promise((resolve) => setTimeout(resolve, 2));
      }
    }
  }
}
