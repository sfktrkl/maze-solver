import * as PIXI from "pixi.js";

export interface ViewSettings {
  width: number;
  height: number;
  lineWidth: number;
  lineColor: number;
  backgroundColor: number;
}

export class AnimationSettings {
  public mazeAnimation: boolean;
  public solverAnimation: boolean;

  constructor() {
    this.mazeAnimation = true;
    this.solverAnimation = true;
  }
}

export class Point {
  constructor(public x: number, public y: number) {}
}

export class Line {
  constructor(public p1: Point, public p2: Point) {}

  draw(vs: ViewSettings, container: PIXI.Container) {
    const line = new PIXI.Graphics();
    line.lineStyle(vs.lineWidth, vs.lineColor);
    line.moveTo(this.p1.x, this.p1.y);
    line.lineTo(this.p2.x, this.p2.y);
    container.addChild(line);
  }
}

export class Graphics {
  constructor(public viewSettings: ViewSettings) {
    this.app = new PIXI.Application({
      width: viewSettings.width,
      height: viewSettings.height,
      antialias: true,
      backgroundColor: viewSettings.backgroundColor,
      resolution: window.devicePixelRatio || 1,
    });

    this.root = new PIXI.Container();
    this.app.stage.addChild(this.root);
  }

  private app: PIXI.Application;
  get application(): PIXI.Application {
    return this.app;
  }

  private root: PIXI.Container;
  get rootContainer(): PIXI.Container {
    return this.root;
  }

  clear(): void {
    this.app.stage.removeChild(this.root);
    this.root = new PIXI.Container();
    this.app.stage.addChild(this.root);
  }

  update(viewSettings: ViewSettings) {
    this.viewSettings = viewSettings;
    this.app = new PIXI.Application({
      width: viewSettings.width,
      height: viewSettings.height,
      antialias: true,
      backgroundColor: viewSettings.backgroundColor,
      resolution: window.devicePixelRatio || 1,
    });
    this.app.stage.addChild(this.root);
  }

  drawLine(line: Line): void {
    line.draw(this.viewSettings, this.root);
  }
}
