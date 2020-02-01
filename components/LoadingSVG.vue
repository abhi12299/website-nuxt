<template>
  <div style="height: 100%">
    <svg
      :style="{ maxWidth: width, maxHeight: height, width, height }"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="#3be8b0"
        stroke-width="6"
        r="35"
        stroke-dasharray="164.93361431346415 56.97787143782138"
        transform="rotate(86.4554 50 50)"
      >
        <animateTransform
          imateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        ></animateTransform>
      </circle>
    </svg>
    <p v-if="text.length">{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '20'
    },
    height: {
      type: String,
      default: '20'
    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
