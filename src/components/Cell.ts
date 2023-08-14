import { Graphics, Line, Point } from "./Graphics";

export class Cell {
  public hasLeftWall = true;
  public hasRightWall = true;
  public hasTopWall = true;
  public hasBottomWall = true;

  constructor(public graphics: Graphics | null) {}

  draw(x1: number, y1: number, x2: number, y2: number): void {
    if (!this.graphics) return;

    if (this.hasLeftWall) {
      const line = new Line(new Point(x1, y1), new Point(x1, y2));
      this.graphics.drawLine(line);
    }
    if (this.hasTopWall) {
      const line = new Line(new Point(x1, y1), new Point(x2, y1));
      this.graphics.drawLine(line);
    }
    if (this.hasRightWall) {
      const line = new Line(new Point(x2, y1), new Point(x2, y2));
      this.graphics.drawLine(line);
    }
    if (this.hasBottomWall) {
      const line = new Line(new Point(x1, y2), new Point(x2, y2));
      this.graphics.drawLine(line);
    }
  }
}
