<script setup lang="ts">
import { BG_COLORS, DEV } from '@/constants'
import type { CeilState } from '@/types'
import FlagSvg from './FlagSvg.vue'
import MineSvg from './MineSvg.vue'

defineProps<{
  ceil: CeilState
}>()

function getCeilClass(ceil: CeilState) {
  if (ceil.flagged) {
    // alpha channel: 50%
    return 'bg-slate-100/50'
  }

  if (!ceil.flipped) {
    // alpha channel: 50%
    return 'hover:bg-slate-300/50 bg-slate-100/50'
  }

  // ceil.flagged === false && ceil.flipped === true
  return ceil.mine ? 'bg-red-300' : BG_COLORS[ceil.adjacentMines]
}
</script>

<template>
  <button
    class="w-[50px] h-[50px] border-1 border-slate-700 cursor-pointer flex justify-center items-center"
    :class="getCeilClass(ceil)"
    style="vertical-align: top"
  >
    <template v-if="ceil.flagged">
      <FlagSvg class="text-red-500" />
    </template>

    <template v-else-if="ceil.flipped || DEV">
      <div v-if="ceil.mine">
        <MineSvg class="text-slate-500" />
      </div>
      <div v-else>{{ ceil.adjacentMines }}</div>
    </template>
  </button>
</template>

<style lang="css"></style>
