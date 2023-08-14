import { Graphics, Line, Point } from "./Graphics";

export class Cell {
  public hasLeftWall = true;
  public hasRightWall = true;
  public hasTopWall = true;
  public hasBottomWall = true;

  constructor(
    private x1: number,
    private y1: number,
    private x2: number,
    private y2: number,
    public graphics: Graphics | null
  ) {}

  draw(): void {
    if (!this.graphics) return;

    if (this.hasLeftWall) {
      const line = new Line(
        new Point(this.x1, this.y1),
        new Point(this.x1, this.y2)
      );
      this.graphics.drawLine(line);
    }
    if (this.hasTopWall) {
      const line = new Line(
        new Point(this.x1, this.y1),
        new Point(this.x2, this.y1)
      );
      this.graphics.drawLine(line);
    }
    if (this.hasRightWall) {
      const line = new Line(
        new Point(this.x2, this.y1),
        new Point(this.x2, this.y2)
      );
      this.graphics.drawLine(line);
    }
    if (this.hasBottomWall) {
      const line = new Line(
        new Point(this.x1, this.y2),
        new Point(this.x2, this.y2)
      );
      this.graphics.drawLine(line);
    }
  }

  drawMove(to: Cell, undo = false): void {
    if (!this.graphics) return;
    if (!this.x1 || !this.y1 || !this.x2 || !this.y2) return;
    if (!to.x1 || !to.y1 || !to.x2 || !to.y2) return;

    const xMid = (this.x1 + this.x2) / 2;
    const yMid = (this.y1 + this.y2) / 2;
    const toXMid = (to.x1 + to.x2) / 2;
    const toYMid = (to.y1 + to.y2) / 2;

    const originalColor = this.graphics.viewSettings.lineColor;
    this.graphics.viewSettings.lineColor = 0xff0000; // red
    if (undo) this.graphics.viewSettings.lineColor = 0x808080; // gray

    let line: Line | null = null;
    let line2: Line | null = null;
    if (this.x1 > to.x1) {
      line = new Line(new Point(this.x1, yMid), new Point(xMid, yMid));
      line2 = new Line(new Point(toXMid, toYMid), new Point(to.x2, toYMid));
    } else if (this.x1 < to.x1) {
      line = new Line(new Point(xMid, yMid), new Point(this.x2, yMid));
      line2 = new Line(new Point(to.x1, toYMid), new Point(toXMid, toYMid));
    } else if (this.y1 > to.y1) {
      line = new Line(new Point(xMid, yMid), new Point(xMid, this.y1));
      line2 = new Line(new Point(toXMid, to.y2), new Point(toXMid, toYMid));
    } else if (this.y1 < to.y1) {
      line = new Line(new Point(xMid, yMid), new Point(xMid, this.y2));
      line2 = new Line(new Point(toXMid, toYMid), new Point(toXMid, to.y1));
    }
    if (line) this.graphics.drawLine(line);
    if (line2) this.graphics.drawLine(line2);
    this.graphics.viewSettings.lineColor = originalColor;
  }
}
