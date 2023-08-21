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
    </div>

    <div class="wrapper-row">
      <form class="form-inline" @submit.prevent="draw">
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
          <button type="submit" class="btn btn-primary" :disabled="drawing">
            Update Maze
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { ViewSettings, Graphics } from "./Graphics";
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
      graphics: null as Graphics | null,

      drawing: false as boolean,

      rowCount: 12 as number,
      columnCount: 16 as number,
    };
  },
  mounted() {
    this.init();
    this.draw();
  },
  methods: {
    init() {
      const element = this.$refs.maze as Element;
      if (!element) return;

      if (!this.graphics) {
        this.graphics = new Graphics(this.vs);
        element.appendChild(this.graphics.application.view);
      }
    },
    clear() {
      if (this.graphics) {
        this.graphics.clear();
      }
    },
    async draw() {
      if (this.drawing) return;
      this.drawing = true;
      this.clear();

      let maze = new Maze(
        this.rowCount,
        this.columnCount,
        this.vs,
        this.graphics as Graphics
      );
      await maze.generateCells();
      await maze.breakEntranceAndExit();
      await maze.breakWalls();
      await maze.resetVisited();
      await maze.solve();

      this.drawing = false;
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
