<template>
  <div ref="rect" class="children" :style="style" @mousedown.prevent.stop.left="startDrag">
    <slot>默认内容</slot>
    <template v-for="(cursor, item) in directions" :key="`${item}-handler`">
      <div :style="{ cursor }" :class="`${zoomableMap[item]} resizable-handler`"
        @mousedown.stop="startResize($event, cursor)" />
      <div :class="`${zoomableMap[item]} square`" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, unref } from 'vue'
import useChildren from '../hooks/useChildren'
const rect = ref(null)
const props = defineProps({
  styleObj: {
    type: Object,
    required: true,
    default: () => ({ top: 0, left: 16, width: 500, height: 500 })
  }
})
const { directions, zoomableMap, startResize, startDrag, style } = useChildren(rect, props)




</script>
<style lang="less" scoped>
.children {
  position: absolute;
  user-select: none;
  cursor: all-scroll;
  background: rgba(24, 144, 255, 0.1);
  border: 1px solid transparent;
  box-sizing: border-box;

  &:hover {
    border: 1px solid #1890ff;
  }

  .square {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #fff;
    border: 1px solid #1890ff;
    border-radius: 50%;
  }

  .resizable-handler {
    position: absolute;
    width: 14px;
    height: 14px;
    cursor: pointer;
    z-index: 1;

    &.tl,
    &.t,
    &.tr {
      top: -7px;
    }

    &.tl,
    &.l,
    &.bl {
      left: -7px;
    }

    &.bl,
    &.b,
    &.br {
      bottom: -7px;
    }

    &.br,
    &.r,
    &.tr {
      right: -7px;
    }

    &.l,
    &.r {
      margin-top: -7px;
    }

    &.t,
    &.b {
      margin-left: -7px;
    }
  }

  .t,
  .tl,
  .tr {
    top: -5px;
  }

  .b,
  .bl,
  .br {
    bottom: -5px;
  }

  .r,
  .tr,
  .br {
    right: -5px;
  }

  .tl,
  .l,
  .bl {
    left: -5px;
  }

  .l,
  .r {
    top: 50%;
    margin-top: -5px;
  }

  .t,
  .b {
    left: 50%;
    margin-left: -5px;
  }
}
</style>