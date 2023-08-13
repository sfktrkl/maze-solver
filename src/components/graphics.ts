import * as PIXI from "pixi.js";

const Graphics = {
  createPIXI(
    width: number,
    height: number,
    backgroundColor: number
  ): [PIXI.Application, PIXI.Container] {
    const application = new PIXI.Application({
      width: width,
      height: height,
      antialias: true,
      backgroundColor: backgroundColor,
      resolution: window.devicePixelRatio || 1,
    });

    const root = new PIXI.Container();
    application.stage.addChild(root);
    return [application, root];
  },
};

export default Graphics;
