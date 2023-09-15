import { ref, reactive, computed, unref, provide } from 'vue'
// 111
const useParent = (props) => {
  const data = reactive({
    left: 0,
    top: 0,
    zoom: 0.3,
  })



  const style = computed(() => ({
    top: `${data.top}px`,
    left: `${data.left}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    transform: `scale(${data.zoom})`,
    transformOrigin: 'top left',
  }))

  let _isMouseDown = false
  // 开始拖动
  const startDrag = (e) => {
    let { clientX: startX, clientY: startY } = e;
    _isMouseDown = true;
    const onMove = e => {
      if (!_isMouseDown) return;
      e.stopImmediatePropagation();
      const { clientX, clientY } = e;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      // 移动距离加上原始距离
      data.left += deltaX;
      data.top += deltaY;

      startX = clientX;
      startY = clientY;
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (!_isMouseDown) return;
      _isMouseDown = false;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }


  const zoom = computed({
    get: () => data.zoom,
    set: (v) => { data.zoom = v }
  })
  provide('zoom', zoom)

  window.addEventListener(
    'mousewheel',
    e => {
      const type = e.deltaY > 5 ? 'sub' : 'plus';
      if (type === 'plus') {
        if (unref(zoom) >= 1.9) return;
        zoom.value += 0.1
      } else {
        if (unref(zoom) <= 0.2) return;
        zoom.value -= 0.1
      }
    },
    false,
  );

  return {
    startDrag,
    style,
    zoom
  }
}
export default useParent