<template>
  <div class="row justify-content-center text-center">
    <div class="title">Maze Solver</div>
    <div class="graphics">
      <div ref="maze" class="mazeGraphics"></div>
    </div>
    <div class="col-8 col-sm-7 col-md-4 col-lg-3 col-xl-2">
      <div class="form-check">
      <label for="mazeAnimation">Maze Generation Animation</label>
      <input
        class="form-check-input"
        type="checkbox"
        id="mazeAnimation"
        v-model="mazeAnimation"
      />
    </div>
    </div>
    <div class="col-8 col-sm-7 col-md-4 col-lg-3 col-xl-2">
      <div class="form-check">
      <label for="solutionAnimation">Solution Animation</label>
      <input
        class="form-check-input"
        type="checkbox"
        id="solutionAnimation"
        v-model="solverAnimation"
      />
    </div>
  </div>
  </div>

  <form class="form-inline" @submit.prevent="generateAndSolveMaze">
    <div class="row justify-content-center text-center my-4">
      <div class="row col-8 col-sm-7 col-md-4 col-lg-3 col-xl-2">
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
      <div class="row col-8 col-sm-7 col-md-4 col-lg-3 col-xl-2">
        <div class="form-group">
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
    </div>
    <div class="row justify-content-center">
      <div class="row col-7 col-sm-6 col-md-3 col-lg-3 col-xl-2">
        <button type="submit" class="btn btn-primary">
          {{ drawing ? "Click to Finish" : "Create New Maze" }}
        </button>
      </div>
    </div>
  </form>
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

      initialSize: null as number | null,
      resizeObserver: null as ResizeObserver | null,

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
  beforeUnmount() {
    const element = this.$refs.maze as Element;
    if (this.resizeObserver && this.$refs.maze)
      this.resizeObserver.unobserve(element);
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

      this.vs.height = this.size * 6;
      this.vs.width = this.size * 8;
      this.graphics.update(this.vs);
      element.appendChild(this.graphics.application.view);

      this.initialSize = element.clientWidth;
      this.resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          const scale = () => {
            const size = element.clientWidth;
            return this.initialSize ? size / this.initialSize : 1.0;
          };
          this.graphics.application.renderer.view.style.width =
            this.graphics.application.renderer.width * scale() + "px";
          this.graphics.application.renderer.view.style.height =
            this.graphics.application.renderer.height * scale() + "px";
        });
      });
      this.resizeObserver.observe(element);
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

.title {
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
</style>
