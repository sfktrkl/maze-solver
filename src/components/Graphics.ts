import * as PIXI from "pixi.js";

export interface ViewSettings {
  width: number;
  height: number;
  animate: boolean;
  lineWidth: number;
  lineColor: number;
  backgroundColor: number;
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
  private vs: ViewSettings;
  get viewSettings(): ViewSettings {
    return this.vs;
  }
  set viewSettings(settings: ViewSettings) {
    this.vs = settings;
  }

  private app: PIXI.Application;
  get application(): PIXI.Application {
    return this.app;
  }

  private root: PIXI.Container;
  get rootContainer(): PIXI.Container {
    return this.root;
  }

  constructor(vs: ViewSettings) {
    this.vs = vs;
    this.app = new PIXI.Application({
      width: vs.width,
      height: vs.height,
      antialias: true,
      backgroundColor: vs.backgroundColor,
      resolution: window.devicePixelRatio || 1,
    });

    this.root = new PIXI.Container();
    this.app.stage.addChild(this.root);
  }

  clear(): void {
    this.app.stage.removeChild(this.root);
    this.root = new PIXI.Container();
    this.app.stage.addChild(this.root);
  }

  drawLine(line: Line): void {
    line.draw(this.vs, this.root);
  }
}
