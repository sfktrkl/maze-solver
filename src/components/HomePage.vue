<template>
  <div class="title">Maze Solver</div>
  <div
    class="graphics"
    :style="{ width: `${vs.width}px`, height: `${vs.height}px` }"
  >
    <div ref="maze" class="mazeGraphics"></div>
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
    };
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      const element = this.$refs.maze as Element;
      if (!element) return;

      if (!this.graphics) {
        this.graphics = new Graphics(this.vs);
        element.appendChild(this.graphics.application.view);
      }

      let maze = new Maze(12, 16, this.vs, this.graphics as Graphics);
      maze.animate();
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
