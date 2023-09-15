

<template>
  <div class="content_bg" @click.right.prevent.stop ref="parentRef">
    {{ zoom }}--{{ styleObj }}
    <div class="page" :style="style" @mousedown.prevent.stop.left="startDrag">
      {{ style }}
      <children v-model:styleObj="styleObj1" />
      <children v-model:styleObj="styleObj" />

    </div>


  </div>
</template>
<script setup>
import { provide, reactive, computed, unref, ref } from 'vue'
import useParent from './hooks/useParent'
import children from './components/children.vue'
const props = defineProps({
  width: {
    type: Number,
    default: 4000,
  },
  height: {
    type: Number,
    default: 2000
  }
})



const parentRef = ref(null)
const { style, startDrag, zoom } = useParent(props)
const styleObj = ref({ top: 80, left: 80, width: 2800, height: 1800 })
const styleObj1 = ref({ top: 1000, left: 3000, width: 100, height: 500 })

</script>
<style scoped>
.content_bg {
  width: 100%;
  height: 100%;
  background: #ccc;
  position: relative;
  overflow: hidden;
}

.page {
  position: absolute;
  user-select: none;
  background: #fff;
  box-sizing: border-box;

}
</style>
