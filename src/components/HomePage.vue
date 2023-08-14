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

      const c1 = new Cell(50, 50, 100, 100, this.graphics as Graphics);
      c1.hasRightWall = false;
      c1.draw();

      const c2 = new Cell(100, 50, 150, 100, this.graphics as Graphics);
      c2.hasLeftWall = false;
      c2.hasBottomWall = false;
      c2.draw();
      c1.drawMove(c2);

      const c3 = new Cell(100, 100, 150, 150, this.graphics as Graphics);
      c3.hasTopWall = false;
      c3.hasRightWall = false;
      c3.draw();
      c2.drawMove(c3);

      const c4 = new Cell(150, 100, 200, 150, this.graphics as Graphics);
      c4.hasLeftWall = false;
      c4.draw();
      c3.drawMove(c4, true);
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
