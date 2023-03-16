<template>
  <div class="hello">
    <h1 class="text-center">Maker</h1>
    <div class="maker-container">
      <div class="canvas-container">
        <canvas class="" ref="can" width="800" height="800"></canvas>
      </div>
      <div id=controls>
        <button id="addNewSquare" @click="addNewSquare">Add New Square</button>
        <button id="evenlySpaceVertically" @click="evenlySpaceVertically">Evenly Space Vertically</button>
        <button id="getCurrentObjects" @click="getCurrentCanvasObjects">Console Log Current Objects</button>
        <button id="reRenderCanvas" @click="reRenderCanvas">Re-Render Canvas</button>
        <button id="undo" @click="undo">Undo</button>
        <button id="redo" @click="redo">Redo</button>
        <select id="color-picker" ref="colorPicker" @change="changeObjColor" :disabled="disableColorPicker">
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { fabric } from 'fabric';
import { History, HistoryActions, registerHandler } from '@/helper/history';
import { DefaultObjectWidth, DefaultObjectHeight, getNewCoords, rand } from '@/helper/utils';

registerHandler(HistoryActions.Add, () => (null), (data, {canvas}) => {
  canvas.remove(data.obj);
  canvas.renderAll();
}, (data, {canvas}) => {
  canvas.add(data.obj, {skipHistory: true});
  canvas.renderAll();
});

registerHandler(HistoryActions.Modified, (e, history) => {
  const observedFields = [
    'angle',
    'flipX',
    'flipY',
    'left',
    'originX',
    'originY',
    'scaleX',
    'scaleY',
    'skewX',
    'skewY',
    'top',
  ];
  const captureObservedFieldValue = (obj) => {
    return observedFields.reduce((ac, field) => {
      ac[field] = obj[field];
      return ac;
    }, {});
  }

  history.add(HistoryActions.Modified, {
    obj: e.target,
    oldValue: captureObservedFieldValue(e.transform.original),
    newValue: captureObservedFieldValue(e.target),
  })
}, (data, {canvas}) => {
  data.obj.set(data.oldValue);
  data.obj.setCoords();
  canvas.renderAll();
}, (data, {canvas}) => {
  data.obj.set(data.newValue);
  data.obj.setCoords();
  canvas.renderAll();
});

export default {
  name: 'Maker',
  data: () => ({
    canvas: null,
    selectedObjs: null,
  }),
  mounted() {
    const ref = this.$refs.can;
    this.canvas = new fabric.Canvas(ref);
    new History(this.canvas);

    this.canvas.on('selection:cleared', () => {
      this.onObjDeselected();
    });
    this.canvas.on('selection:updated', () => {
      this.onObjSelected(this.canvas.getActiveObjects());
    });
    this.canvas.on('selection:created', () => {
      this.onObjSelected(this.canvas.getActiveObjects());
    });

    this.addNewSquare()
  },
  methods: {
    addNewSquare() {
      const canvas = this.canvas;
      const coords = getNewCoords(canvas);
      const rect = new fabric.Rect({
        fill: randomRgba(0.2),
        width: DefaultObjectWidth,
        height: DefaultObjectHeight,
        ...coords,
      });

      canvas.add(rect);
    },
    evenlySpaceVertically(){
      const objs = this.canvas.getObjects();
      const canvasHeight = this.canvas.height - 100;
      const canvasWidth = this.canvas.height;
      const spacing = canvasHeight / objs.length;

      const offset = spacing / 2;

      objs.forEach((obj, i) => {
        this.moveObj(obj, i, (canvasWidth - obj.width * (obj.zoomX / 2)) / 2, i * spacing + offset);
      });

      this.canvas.renderAll();
    },
    moveObj(obj, i, left, top, bypassHistory) {
      const canvas = this.canvas;
      const oldValue = {
        left: obj.left,
        top: obj.top,
      };
      obj.set({
        left,
        top,
      });
      obj.setCoords();
      if (!bypassHistory) {
        canvas.history.add(HistoryActions.Modified, {
          obj,
          oldValue,
          newValue: {
            left: obj.left,
            top: obj.top,
          }
        })
      }
    },
    reRenderCanvas() {
      this.canvas.renderAll();
    },
    getCurrentCanvasObjects(){
      const objs = this.canvas.getObjects();
      console.log(objs);
      return objs;
    },
    undo() {
      this.canvas.history.undo();
    },
    redo() {
      this.canvas.history.redo();
    },
    changeObjColor(e) {
      const color = e?.target?.value;
      if (!this.selectedObjs) {
        return;
      }
      this.selectedObjs[0].set('fill', color)
      this.canvas.renderAll();
    },
    onObjSelected(selectedObjs) {
      this.selectedObjs = selectedObjs;
      if (this.selectedObjs.length > 1) {
        this.$refs.colorPicker.disabled = true;
      } else {
        this.$refs.colorPicker.disabled = false;
      }
    },
    onObjDeselected() {
      this.selectedObjs = null;
      this.$refs.colorPicker.disabled = true;
    }
  }
}
</script>

<style>
.maker-container {
  display: flex;
  flex-direction: row;
  margin: 0 20px;
}

.text-center {
  background: gray;
  padding: 20px;
  margin-bottom: 20px;
  font-weight: bolder;
  color: white;
  font-size: 2em;
}

.canvas-container {
  border: 1px solid gray;
}

#controls {
  display: flex;
  background: lightgray;
  flex-direction: column;
  /* 800px of canvas width and 20px of the margin*/
  width: calc(100% - 820px);
  margin-left: 20px;
  padding-top: 20px;
}

#controls button {
  width: 250px;
  padding: 10px;
  background: gray;
  color: white;
  display: block;
  margin: 10px auto;
}
</style>
