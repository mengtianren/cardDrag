
import { unref, ref, reactive, computed, inject, defineProps, defineEmits } from 'vue'
import { getCursor, getLength, getNewStyle, centerToTL } from '../utils'
// 子组件放大缩小1212
const useChildren = (el, props, emits) => {
  const zoom = inject('zoom')
  const data = reactive({
    zoomable: 'n, w, s, e, nw, ne, se, sw',
    zoomableMap: {
      n: 't',
      s: 'b',
      e: 'r',
      w: 'l',
      ne: 'tr',
      nw: 'tl',
      se: 'br',
      sw: 'bl',
    },
  })
  const resizeStartRect = reactive({})



  const zoomables = computed(() => data.zoomable.split(',').map((d) => d.trim()).filter((d) => d))
  const directions = computed(() => zoomables.value.reduce((res, d) => {
    res[d] = `${getCursor(0, d)}-resize`;
    return res;
  }, {}))
  const resizeStart = () => {
    const { offsetHeight: height, offsetWidth: width, offsetLeft: left, offsetTop: top } = unref(el);
    const styles = {
      width,
      height,
      centerX: left + width / 2,
      centerY: top + height / 2,
    };
    Object.assign(resizeStartRect, styles)
  }


  let _isMouseDown = false
  //放大缩小
  const startResize = (e, cursor) => {
    if (e.button !== 0) return;
    document.body.style.cursor = cursor;
    resizeStart();
    console.log('默认')
    const type = e.target.getAttribute('class').split(' ')[0];
    const { clientX: startX, clientY: startY } = e;
    _isMouseDown = true;
    const onMove = (e) => {
      if (!_isMouseDown) return; // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation();
      const { clientX, clientY } = e;
      const deltaX = (clientX - startX) / unref(zoom);
      const deltaY = (clientY - startY) / unref(zoom);
      const alpha = Math.atan2(deltaY, deltaX);
      const deltaL = getLength(deltaX, deltaY);
      const isShiftKey = e.shiftKey; // 判断是否为系统级缩放

      handleResize(deltaL, alpha, type, isShiftKey);
    };

    const onUp = () => {
      document.body.style.cursor = 'auto';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (!_isMouseDown) return;
      _isMouseDown = false;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  // jisuanbili
  const handleResize = (length, alpha, type, isShiftKey) => {
    const rect = resizeStartRect;
    const deltaW = length * Math.cos(alpha);
    const deltaH = length * Math.sin(alpha);
    const ratio = isShiftKey ? rect.width / rect.height : false;

    const {
      position: { centerX, centerY },
      size: { width, height },
    } = getNewStyle(type, rect, deltaW, deltaH, ratio);

    const { top: nTop, left: nLeft, width: nWidth, height: nHeight } = centerToTL({
      centerX,
      centerY,
      width,
      height,
    });

    props.styleObj.top = nTop
    props.styleObj.left = nLeft
    props.styleObj.width = nWidth
    if (unref(zoomables).includes('n') || unref(zoomables).includes('s')) {
      props.styleObj.height = nHeight
    }

  }

  // 开始拖动
  const startDrag = (e) => {
    let { clientX: startX, clientY: startY } = e;
    _isMouseDown = true;
    const onMove = (e) => {
      if (!_isMouseDown) return;
      e.stopImmediatePropagation();
      const { clientX, clientY } = e;
      const deltaX = (clientX - startX) / unref(zoom);
      const deltaY = (clientY - startY) / unref(zoom);
      // 移动距离加上原始距离
      props.styleObj.left += deltaX;
      props.styleObj.top += deltaY;


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

  const style = computed(() => ({
    top: `${props.styleObj.top}px`,
    left: `${props.styleObj.left}px`,
    width: `${props.styleObj.width}px`,
    height: `${props.styleObj.height}px`,
  }))


  return {
    directions,
    zoomableMap: data.zoomableMap,
    startResize,
    startDrag,
    style
  }

}

export default useChildren