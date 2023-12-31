import { Graphics, Line, Point } from "./Graphics";

export class Cell {
  public leftWall = true;
  public rightWall = true;
  public topWall = true;
  public bottomWall = true;
  public visited = false;

  constructor(
    private x1: number,
    private y1: number,
    private x2: number,
    private y2: number,
    public graphics: Graphics | null
  ) {}

  async draw(animate: boolean): Promise<void> {
    if (!this.graphics) return;
    const originalColor = this.graphics.viewSettings.lineColor;

    let line = null;
    line = new Line(new Point(this.x1, this.y1), new Point(this.x1, this.y2));
    this.graphics.viewSettings.lineColor = this.leftWall ? 0x000000 : 0xffffff;
    this.graphics.drawLine(line);

    line = new Line(new Point(this.x1, this.y1), new Point(this.x2, this.y1));
    this.graphics.viewSettings.lineColor = this.topWall ? 0x000000 : 0xffffff;
    this.graphics.drawLine(line);

    line = new Line(new Point(this.x2, this.y1), new Point(this.x2, this.y2));
    this.graphics.viewSettings.lineColor = this.rightWall ? 0x000000 : 0xffffff;
    this.graphics.drawLine(line);

    line = new Line(new Point(this.x1, this.y2), new Point(this.x2, this.y2));
    this.graphics.viewSettings.lineColor = this.bottomWall
      ? 0x000000
      : 0xffffff;
    this.graphics.drawLine(line);

    this.graphics.viewSettings.lineColor = originalColor;
    if (animate) return new Promise((resolve) => setTimeout(resolve, 10));
  }

  async drawMove(to: Cell, undo: boolean, animate: boolean): Promise<void> {
    if (!this.graphics) return;

    const xMid = (this.x1 + this.x2) / 2;
    const yMid = (this.y1 + this.y2) / 2;
    const toXMid = (to.x1 + to.x2) / 2;
    const toYMid = (to.y1 + to.y2) / 2;

    const originalColor = this.graphics.viewSettings.lineColor;
    this.graphics.viewSettings.lineColor = 0x0000ff; // blue
    if (undo) this.graphics.viewSettings.lineColor = 0x00ff00; // green

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
    if (animate) return new Promise((resolve) => setTimeout(resolve, 50));
  }
}
