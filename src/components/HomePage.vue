<template>
  <div class="wrapper">
    <div class="wrapper-row">
      <div class="title">Maze Solver</div>
      <div
        class="graphics"
        :style="{ width: `${size * 8}px`, height: `${size * 6}px` }"
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
        <div class="row justify-content-center text-center">
          <div class="col-5">
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
          <div class="col-5">
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
        <div class="row justify-content-center">
          <div class="row col-5 my-2">
            <button type="submit" class="btn btn-primary">
              {{ drawing ? "Click to Finish" : "Create New Maze" }}
            </button>
          </div>
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
    const vs = {
      height: 600,
      width: 800,
      lineWidth: 2,
      lineColor: 0x000000,
      backgroundColor: 0xffffff,
    } as ViewSettings;
    const graphics = new Graphics(vs);
    const animation = new AnimationSettings();

    return {
      vs,
      graphics,
      animation,

      drawing: false as boolean,
      quick: null as [boolean, boolean] | null,

      mazeAnimation: true as boolean,
      solverAnimation: true as boolean,

      rowCount: 12 as number,
      columnCount: 16 as number,
    };
  },
  async mounted() {
    this.updateGraphics();
    await this.generateAndSolveMaze();
  },
  computed: {
    size() {
      const width = (window.innerWidth * 2) / 3;
      const height = (window.innerHeight * 2) / 3;
      return Math.min(height / 6, width / 8);
    },
  },
  methods: {
    updateGraphics() {
      const element = this.$refs.maze as Element;
      if (element.childNodes.length > 0)
        element.removeChild(this.graphics.application.view);

      this.vs.height = this.size * 6;
      this.vs.width = this.size * 8;
      this.graphics.update(this.vs);
      element.appendChild(this.graphics.application.view);
      return;
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
        this.graphics.clear();

        let maze = new Maze(
          this.rowCount,
          this.columnCount,
          this.vs,
          this.animation,
          this.graphics as Graphics
        );
        await maze.generate();
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
