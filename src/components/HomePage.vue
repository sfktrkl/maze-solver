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
import { ViewSettings, Graphics, Point, Line } from "./Graphics";

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
      if (!this.graphics) {
        this.graphics = new Graphics(this.vs);
        element.appendChild(this.graphics.application.view);
      }

      this.graphics.drawLine(new Line(new Point(50, 50), new Point(400, 400)));
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
