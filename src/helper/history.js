export const HistoryActions = {
  Add: 'add',
  Move: 'move',
  Modified: 'modified',
}

export function History(canvas) {
  this.canvas = canvas;
  this.data = [];
  this.cursor = -1;
  this.actionHandlers = {};
  this.registerHandler = (action, onEvent, onUndo, onRedo) => {
    this.actionHandlers[action] = {
      onEvent,
      onUndo,
      onRedo,
    }
  }

  const canvasAdd = canvas.add;
  canvas.add = (obj, option) => {
    const response = canvasAdd.call(canvas, obj);
    if (!option?.skipHistory) {
      this.add(HistoryActions.Add, {
        obj,
        oldValue: null,
        newValue: null,
      });
    }
    return response;
  }

  canvas.on('object:modified', (e) => {
    this.actionHandlers[HistoryActions.Modified].onEvent(e);
  });

  this.add = (action, params) => {
    console.log('adding history', action, params, this.cursor, this.data.length - 1);
    if (this.cursor < this.data.length - 1) {
      this.data.splice(this.cursor, this.data.length - this.cursor - 1);
    }

    this.data.push({
      action,
      params,
    });

    this.cursor++;
  };

  this.undo = () => {
    console.log('undo', this.cursor, this.data[this.cursor]);
    if (this.cursor < 0) {
      return;
    }
    const data = this.data[this.cursor];
    this.actionHandlers[data.action].onUndo(data.params);
    this.cursor--;
  }

  this.redo = () => {
    if (this.cursor >= this.data.length - 1) {
      return;
    }
    this.cursor++;
    const data = this.data[this.cursor];
    this.actionHandlers[data.action].onRedo(data.params);
  }

  this.observe = (obj, event) => {
    obj.on(event, (e) => {
      this.actionHandlers[event].onEvent(e);
    })
  }
}