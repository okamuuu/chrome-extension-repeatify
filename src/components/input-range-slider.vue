<template>
  <input 
    ref="input"
    class="slider" 
    :class="{ muted }"
    type="range" 
    :min="min" 
    :max="max" 
    :step="step" 
    v-model="value"
    @input="handleInput"
    @change="handleChange"
    :style="`background: ${bgColor}`"
  >
</template>

<script>
export default {
  name: 'input-range-slider',
  props: ['min', 'max', 'value', 'step', 'onInput', 'onChange', 'muted'],
  data() {
    return {
      value: 1
    }
  },
  computed: {
  },
  created() {
    console.log('created')
  },
  mounted() {
  },
  methods: {
    handleInput() {
      this.onInput(this.value)
    },
    handleChange() {
      if (!this.onChange) {
        return
      }
      this.onChange(this.value)
    }
  },
  computed: {
    bgColor() { 
      const x = this.muted ? 0 : this.value * 100 / this.max
      return `linear-gradient(90deg, RGB(255, 255, 255, 1) ${x}%, RGB(255, 255, 255, 0.2) ${x}%)`
    }
  }
};
</script>

<style scoped>
.sliderContainer {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.slider {
  width: 100%;
  -webkit-appearance: none;
  transition: opacity 0.2s;
  height: 4px;
  outline: none;
  background: linear-gradient(90deg, RGB(255, 255, 255, 1) 100%, RGB(255, 255, 255, 0.2) 100%);
}
.slider::-webkit-slider-runnable-track {
  cursor: pointer;
  margin: 0 -7px;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: rgb(255, 255, 255);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
}
.slider.muted::-webkit-slider-thumb {
  opacity: 0;
}

/*
.sliderContainer:hover .slider::-webkit-slider-thumb {
  opacity: 1;
}
*/
</style>
