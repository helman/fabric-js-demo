export function rand(max, min = 0) {
  return Math.round(Math.random() * (max - min)) + min;
}

export function randFloat(max, min = 0) {
  return Math.random() * (max - min) + min;
}

export function randomRgba(minOpacity = 0) {
  const range = 255;
  return 'rgba(' + rand(range) + ',' + rand(range) + ',' + rand(range) + ',' + randFloat(1, minOpacity).toFixed(1) + ')';
}

export const DefaultObjectWidth = 100;
export const DefaultObjectHeight = 100;

export function getLastObject(canvas) {
  const allObjects = canvas.getObjects();
  return allObjects.length ? allObjects[allObjects.length - 1] : null;
}

export function getNewCoords(canvas) {
  const lastObj = getLastObject(canvas);
  const constrainVertical = canvas.height;
  const constrainHorizontal = canvas.width;
  const newCoords = {
    left: lastObj?.left + 15 || 0,
    top: lastObj?.top + 10 || 0,
  }

  if (newCoords.left + DefaultObjectWidth > constrainHorizontal) {
    newCoords.left = 0;
  }
  if (newCoords.top + DefaultObjectHeight > constrainVertical) {
    newCoords.top = 0;
  }

  return newCoords;
}