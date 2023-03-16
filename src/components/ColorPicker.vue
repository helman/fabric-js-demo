<template>
  <div>
    <div class="wrapper-dropdown" :style="`${!disabled ? '' : 'background: #ddd; opacity: 0.7;'}`">
      <span @click="toggleDropdown()" v-html="selector"></span>
      <ul class="dropdown" v-show="active">
        <li v-for="color in options" :key="color.hex" @click="setColor(color.hex, color.name)">
          <span :style="{background: color.hex}"></span> {{color.name}}
        </li>
      </ul>
      <input type="hidden" v-model="selectedColor">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorPicker',
  props: ['label', 'value', 'options', 'disabled', 'input-id'],
  data: () => {
    return {
      active: false,
      selectedColor: null,
      selectedColorName: null,
    }
  },
  computed: {
    selector: function() {
      if(!this.selectedColor) {
        return this.label;
      } else {
        return '<span class="px-3 py-0 mr-1" style="background: ' + this.selectedColor + '"></span> ' + this.selectedColorName;
      }
    }
  },
  methods: {
    setColor: function(color, colorName) {
      this.active = false;
      if (this.disabled) {
        return;
      }
      this.selectedColor = color;
      this.selectedColorName = colorName;
      this.$emit('change', {
        value: this.selectedColor
      });
    },
    toggleDropdown: function() {
      this.active = !this.active && !this.disabled;
    },
  }
}
</script>
<style scoped>
.wrapper-dropdown {
  position: relative;
  width: 100%;
  background: #FFF;
  color: #2e2e2e;
  outline: none;
  cursor: pointer;
}

.wrapper-dropdown > span {
  width: 100%;
  display: block;
  border: 1px solid #ababab;
  padding: 5px;
}
.wrapper-dropdown > span > span {
  padding: 0 12px;
  margin-right: 5px;
}
.wrapper-dropdown > span:after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  right: 16px;
  top: calc(50% + 4px);
  margin-top: -6px;
  border-width: 6px 6px 0 6px;
  border-style: solid;
  border-color: #2e2e2e transparent;
}

.wrapper-dropdown .dropdown {
  position: absolute;
  z-index: 10;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  font-weight: normal;
  list-style-type: none;
  padding-left: 0;
  margin: 0;
  border: 1px solid #ababab;
  border-top: 0;
}

.wrapper-dropdown .dropdown li {
  display: block;
  text-decoration: none;
  color: #2e2e2e;
  padding: 5px;
  cursor: pointer;
  min-height: 28px;
  text-align: left;
}

.wrapper-dropdown .dropdown li > span {
  padding: 0 12px;
  margin-right: 5px;
}

.wrapper-dropdown .dropdown li:hover {
  background: #eee;
  cursor: pointer;
}
</style>
