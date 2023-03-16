export const HistoryActions = {
  Add: 'add',
  Move: 'move',
  Modified: 'modified',
}

const actionHandlers = {};
export function registerHandler(action, onEvent, onUndo, onRedo) {
  actionHandlers[action] = {
    onEvent,
    onUndo,
    onRedo,
  }
}

export function History(canvas) {
  canvas.history = this;
  this.canvas = canvas;
  this.data = [];
  this.cursor = -1;

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
    actionHandlers[HistoryActions.Modified].onEvent(e, this);
  });

  this.add = (action, params) => {
    if (this.cursor < this.data.length - 1) {
      this.data.splice(this.cursor + 1, this.data.length - this.cursor - 1);
    }

    this.data.push({
      action,
      params,
    });

    this.cursor++;
  };

  this.undo = () => {
    if (this.cursor < 0) {
      return;
    }
    const data = this.data[this.cursor];
    actionHandlers[data.action].onUndo(data.params, this);
    this.cursor--;
  }

  this.redo = () => {
    if (this.cursor >= this.data.length - 1) {
      return;
    }
    this.cursor++;
    const data = this.data[this.cursor];
    actionHandlers[data.action].onRedo(data.params, this);
  }
}