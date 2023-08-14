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
import { Cell } from "./Cell";

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

      const c1 = new Cell(this.graphics as Graphics);
      c1.hasLeftWall = false;
      c1.draw(50, 50, 100, 100);

      const c2 = new Cell(this.graphics as Graphics);
      c2.hasRightWall = false;
      c2.draw(125, 125, 200, 200);

      const c3 = new Cell(this.graphics as Graphics);
      c3.hasBottomWall = false;
      c3.draw(225, 225, 250, 250);

      const c4 = new Cell(this.graphics as Graphics);
      c4.hasTopWall = false;
      c4.draw(300, 300, 500, 500);
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
