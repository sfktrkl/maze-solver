<template>
  <div class="title">Maze Solver</div>
  <div
    class="graphics"
    :style="{ width: `${vs.width}px`, height: `${vs.width}px` }"
  >
    <div ref="maze" class="mazeGraphics"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Graphics from "./graphics";
import * as PIXI from "pixi.js";

interface ViewSettings {
  height: number;
  width: number;
}

export default defineComponent({
  name: "HomePage",
  data() {
    return {
      vs: { height: 800, width: 600 } as ViewSettings,
      app: null as PIXI.Application | null,
      root: null as PIXI.Container | null,
    };
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      const element = this.$refs.maze as Element;
      if (!this.app) {
        const [app, root] = Graphics.createPIXI(
          element.clientWidth,
          element.clientHeight,
          0xffffff
        );
        this.app = app;
        this.root = root;
        element.appendChild(this.app.view);
      }
    },
  },
});
</script>

<style scoped>
.title {
  text-align: center;
  padding: 20px;
  margin: auto;
  width: 50%;
}

.graphics {
  border: 2px solid green;
  background-color: green;
  margin: auto;
}

.mazeGraphics {
  height: inherit;
  width: inherit;
}
</style>
