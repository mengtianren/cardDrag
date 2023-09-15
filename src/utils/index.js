import _ from 'lodash-es';

export const getLength = (x, y) => Math.sqrt(x * x + y * y);

/**
 * 两点坐标角度
 * @param {*} param0
 * @param {*} param1
 */
export const getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
  const dot = x1 * x2 + y1 * y2;
  const det = x1 * y2 - y1 * x2;
  const angle = (Math.atan2(det, dot) / Math.PI) * 180;
  return (angle + 360) % 360;
};

/**
 * 角度转弧度
 * @param {*} deg
 */
export const degToRadian = deg => (deg * Math.PI) / 180;

const cos = deg => Math.cos(degToRadian(deg));
const sin = deg => Math.sin(degToRadian(deg));

const setWidthAndDeltaW = (width, deltaW, minWidth) => {
  const expectedWidth = width + deltaW;
  if (expectedWidth > minWidth) {
    width = expectedWidth;
  } else {
    deltaW = minWidth - width;
    width = minWidth;
  }
  return { width, deltaW };
};

const setHeightAndDeltaH = (height, deltaH, minHeight) => {
  const expectedHeight = height + deltaH;
  if (expectedHeight > minHeight) {
    height = expectedHeight;
  } else {
    deltaH = minHeight - height;
    height = minHeight;
  }
  return { height, deltaH };
};

export const getNewStyle = (
  type,
  rect,
  deltaW,
  deltaH,
  ratio,
  minWidth = 0,
  minHeight = 0,
) => {
  let { width, height, centerX, centerY } = rect;
  const { rotateAngle = 0 } = rect;
  const widthFlag = width < 0 ? -1 : 1;
  const heightFlag = height < 0 ? -1 : 1;
  width = Math.abs(width);
  height = Math.abs(height);
  switch (type) {
    case 'r': {
      ({ width, deltaW } = setWidthAndDeltaW(width, deltaW, minWidth));
      if (ratio) {
        deltaH = deltaW / ratio;
        height = width / ratio;
        // 左上角固定
        centerX +=
          (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
        centerY +=
          (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
      } else {
        // 左边固定
        centerX += (deltaW / 2) * cos(rotateAngle);
        centerY += (deltaW / 2) * sin(rotateAngle);
      }
      break;
    }
    case 'tr': {
      deltaH = -deltaH;
      ({ width, deltaW } = setWidthAndDeltaW(width, deltaW, minWidth));
      ({ height, deltaH } = setHeightAndDeltaH(height, deltaH, minHeight));
      if (ratio) {
        deltaW = deltaH * ratio;
        width = height * ratio;
      }
      centerX +=
        (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
      centerY +=
        (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
      break;
    }
    case 'br': {
      ({ width, deltaW } = setWidthAndDeltaW(width, deltaW, minWidth));
      ({ height, deltaH } = setHeightAndDeltaH(height, deltaH, minHeight));
      if (ratio) {
        deltaW = deltaH * ratio;
        width = height * ratio;
      }
      centerX +=
        (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
      centerY +=
        (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
      break;
    }
    case 'b': {
      ({ height, deltaH } = setHeightAndDeltaH(height, deltaH, minHeight));
      if (ratio) {
        deltaW = deltaH * ratio;
        width = height * ratio;
        // 左上角固定
        centerX +=
          (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
        centerY +=
          (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
      } else {
        // 上边固定
        centerX -= (deltaH / 2) * sin(rotateAngle);
        centerY += (deltaH / 2) * cos(rotateAngle);
      }
      break;
    }
    case 'bl': {
      deltaW = -deltaW;
      ({ width, deltaW } = setWidthAndDeltaW(width, deltaW, minWidth));
      ({ height, deltaH } = setHeightAndDeltaH(height, deltaH, minHeight));
      if (ratio) {
        height = width / ratio;
        deltaH = deltaW / ratio;
      }
      centerX -=
        (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
      centerY -=
        (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
      break;
    }
    case 'l': {
      deltaW = -deltaW;
      ({ width, deltaW } = setWidthAndDeltaW(width, deltaW, minWidth));
      if (ratio) {
        height = width / ratio;
        deltaH = deltaW / ratio;
        // 右上角固定
        centerX -=
          (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
        centerY -=
          (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
      } else {
        // 右边固定
        centerX -= (deltaW / 2) * cos(rotateAngle);
        centerY -= (deltaW / 2) * sin(rotateAngle);
      }
      break;
    }
    case 'tl': {
      deltaW = -deltaW;
      deltaH = -deltaH;
      ({ width, deltaW } = setWidthAndDeltaW(width, deltaW, minWidth));
      ({ height, deltaH } = setHeightAndDeltaH(height, deltaH, minHeight));
      if (ratio) {
        width = height * ratio;
        deltaW = deltaH * ratio;
      }
      centerX -=
        (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle);
      centerY -=
        (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle);
      break;
    }
    case 't': {
      deltaH = -deltaH;
      ({ height, deltaH } = setHeightAndDeltaH(height, deltaH, minHeight));
      if (ratio) {
        width = height * ratio;
        deltaW = deltaH * ratio;
        // 左下角固定
        centerX +=
          (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle);
        centerY +=
          (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle);
      } else {
        centerX += (deltaH / 2) * sin(rotateAngle);
        centerY -= (deltaH / 2) * cos(rotateAngle);
      }
      break;
    }
    default:
      break;
  }

  return {
    position: {
      centerX,
      centerY,
    },
    size: {
      width: width * widthFlag,
      height: height * heightFlag,
    },
  };
};

const cursorStartMap = { n: 0, ne: 1, e: 2, se: 3, s: 4, sw: 5, w: 6, nw: 7 };
const cursorDirectionArray = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
const cursorMap = {
  0: 0,
  1: 1,
  2: 2,
  3: 2,
  4: 3,
  5: 4,
  6: 4,
  7: 5,
  8: 6,
  9: 6,
  10: 7,
  11: 8,
};
export const getCursor = (rotateAngle, d) => {
  const increment = cursorMap[Math.floor(rotateAngle / 30)];
  const index = cursorStartMap[d];
  const newIndex = (index + increment) % 8;
  return cursorDirectionArray[newIndex];
};

export const centerToTL = ({
  centerX,
  centerY,
  width,
  height,
  rotateAngle = 0,
}) => ({
  top: centerY - height / 2,
  left: centerX - width / 2,
  width,
  height,
  rotateAngle,
});

export const tLToCenter = ({ top, left, width, height, rotateAngle }) => ({
  position: {
    centerX: left + width / 2,
    centerY: top + height / 2,
  },
  size: {
    width,
    height,
  },
  transform: {
    rotateAngle,
  },
});

/**
 * 坐标旋转
 * @param {*} param0
 * @param {*} param1
 * @param {*} θ
 */
export const pointRotate = ([rx0, ry0], [x, y], θ) => {
  const radian = (Math.PI / 180) * θ;
  const cosθ = Math.cos(radian);
  const sinθ = Math.sin(radian);
  const x0 = (x - rx0) * cosθ - (y - ry0) * sinθ + rx0;
  const y0 = (x - rx0) * sinθ + (y - ry0) * cosθ + ry0;
  return [x0, y0];
};

/**
 * 矩形转换为坐标点
 * @param {*} param0
 */
export const rectToPoints = ({ top, left, width, height, rotateAngle = 0 }) => {
  const cx = left + width / 2;
  const cy = top + height / 2;
  const cp = [cx, cy];
  return [
    cp,
    pointRotate(cp, [left, top], rotateAngle),
    pointRotate(cp, [left + width, top], rotateAngle),
    pointRotate(cp, [left + width, top + height], rotateAngle),
    pointRotate(cp, [left, top + height], rotateAngle),
  ];
};

/**
 * 矩形辅助线
 * @param {*} rect
 */
export const rectToLines = rect =>
  _.reduce(
    rectToPoints(rect),
    (res, [x, y]) => {
      res.xLines.push(x);
      res.yLines.push(y);
      return res;
    },
    { xLines: [], yLines: [] },
  );

/**
 * 查找辅助线
 * @param {*} lines
 * @param {*} targets
 */
export const filterLines = (lines, targets) => {
  lines = _.uniq(lines.map(Math.round));
  targets = _.uniq(targets.map(Math.round));
  return _.filter(targets, i => _.find(lines, n => Math.abs(n - i) <= 1));
};
