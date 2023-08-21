<template>
  <div class="wrapper">
    <div class="wrapper-row">
      <div class="title">Maze Solver</div>
      <div
        class="graphics"
        :style="{ width: `${vs.width}px`, height: `${vs.height}px` }"
      >
        <div ref="maze" class="mazeGraphics"></div>
      </div>
      <div class="form-check col">
        <label for="mazeAnimation">Maze Generation Animation</label>
        <input
          class="form-check-input"
          type="checkbox"
          id="mazeAnimation"
          v-model="mazeAnimation"
        />
      </div>
      <div class="form-check col">
        <label for="solutionAnimation">Solution Animation</label>
        <input
          class="form-check-input"
          type="checkbox"
          id="solutionAnimation"
          v-model="solverAnimation"
        />
      </div>
    </div>

    <div class="wrapper-row">
      <form class="form-inline" @submit.prevent="generateAndSolveMaze">
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label for="row">Maze row count</label>
              <input
                class="form-control"
                type="number"
                id="row"
                min="2"
                v-model="rowCount"
              />
            </div>
          </div>
          <div class="col">
            <label for="column">Maze column count</label>
            <input
              class="form-control"
              type="number"
              id="column"
              min="2"
              v-model="columnCount"
            />
          </div>
        </div>
        <div class="col-auto my-1">
          <button type="submit" class="btn btn-primary">
            {{ drawing ? "Click to Finish" : "Create New Maze" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { ViewSettings, AnimationSettings, Graphics } from "./Graphics";
import { Maze } from "./Maze";

export default defineComponent({
  name: "HomePage",
  data() {
    return {
      vs: {
        height: 600,
        width: 800,
        lineWidth: 2,
        lineColor: 0x000000,
        backgroundColor: 0xffffff,
      } as ViewSettings,

      animation: new AnimationSettings() as AnimationSettings,
      graphics: null as Graphics | null,

      drawing: false as boolean,
      quick: null as [boolean, boolean] | null,

      mazeAnimation: true as boolean,
      solverAnimation: true as boolean,

      rowCount: 12 as number,
      columnCount: 16 as number,
    };
  },
  mounted() {
    this.initializeGraphics();
    this.generateAndSolveMaze();
  },
  methods: {
    initializeGraphics() {
      const element = this.$refs.maze as Element;
      if (!element) return;

      if (!this.graphics) {
        this.graphics = new Graphics(this.vs);
        element.appendChild(this.graphics.application.view);
      }
    },
    clearGraphics() {
      if (this.graphics) {
        this.graphics.clear();
      }
    },
    async generateAndSolveMaze() {
      if (this.drawing) {
        this.quick = [
          this.animation.mazeAnimation,
          this.animation.solverAnimation,
        ];
        this.animation.mazeAnimation = false;
        this.animation.solverAnimation = false;
      } else {
        this.drawing = true;
        this.clearGraphics();

        let maze = new Maze(
          this.rowCount,
          this.columnCount,
          this.vs,
          this.graphics as Graphics
        );
        await maze.generateCells(this.animation);
        await maze.breakEntranceAndExit();
        await maze.breakWalls();
        await maze.resetVisited();
        await maze.solve();

        this.drawing = false;
      }
    },
  },
  watch: {
    mazeAnimation() {
      this.animation.mazeAnimation = this.mazeAnimation;
    },
    solverAnimation() {
      this.animation.solverAnimation = this.solverAnimation;
    },
    drawing() {
      if (this.quick && this.drawing == false) {
        this.animation.mazeAnimation = this.quick[0];
        this.animation.solverAnimation = this.quick[1];
        this.quick = null;
      }
    },
  },
});
</script>

<style scoped>
.wrapper {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
}

.wrapper-row {
  height: 100%;
  margin: auto;
  padding-top: 1em;
}

.title {
  text-align: center;
  padding-bottom: 1em;
}
</style>
