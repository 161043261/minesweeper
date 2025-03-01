<script setup lang="ts">
import { reactive } from 'vue'
import MineSvg from './components/MineSvg.vue'

const WIDTH = 10
const HEIGHT = 10

interface CeilState {
  x: number
  y: number
  flipped: boolean // 是否被翻开
  isMine?: boolean // 是否为炸弹
  adjacentMines: number // 相邻的炸弹数
}

const ceilsGrid = reactive<CeilState[][]>(
  Array.from(
    {
      length: HEIGHT,
    },
    (_, y) =>
      Array.from(
        {
          length: WIDTH,
        },
        (_, x): CeilState => {
          return {
            x,
            y,
            flipped: false,
            adjacentMines: 0,
          }
        },
      ),
  ),
)

const directions = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
]

function generateMines() {
  for (const ceilsRow of ceilsGrid) {
    for (const ceil of ceilsRow) {
      ceil.isMine = Math.random() < 0.3
    }
  }
}

function setAdjacentMines() {
  ceilsGrid.forEach((ceilsRow, y) => {
    ceilsRow.forEach((ceil, x) => {
      if (ceil.isMine) {
        return
      }
      directions.forEach(([dx, dy]) => {
        const x2 = x + dx
        const y2 = y + dy
        if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) {
          return
        }
        if (ceilsGrid[y2][x2].isMine) {
          ceil.adjacentMines++
        }
      })
    })
  })
}

const handleClick = (ceil: CeilState) => {
  console.log(ceil.x, ' ', ceil.y)
  ceil.flipped = true
}

const getCeilClass = (ceil: CeilState) => {
  if (!ceil.flipped) {
    return 'bg-slate-100/50' // alpha channel: 50%
  }
  return ceil.isMine ? 'bg-red-300' : bgColors[ceil.adjacentMines]
}

const bgColors = [
  'bg-transparent', // 0
  'bg-orange-300', // 1
  // amber
  'bg-yellow-300', // 2
  // lime
  'bg-green-300', // 3
  // emerald
  'bg-teal-300', // 4
  // cyan
  'bg-sky-300', // 5
  // blue
  'bg-indigo-300', // 6
  // violet
  'bg-purple-300', // 7
  // fuchsia
  'bg-pink-300', // 8
  // rose
]
generateMines()
setAdjacentMines()
</script>

<template>
  <main class="flex flex-col items-center justify-center h-dvh w-dvw">
    <h1 class="text-3xl text-slate-700">Minesweeper</h1>
    <div class="mt-[20px] border-1 border-slate-700">
      <!-- button: 行内块, 行内块元素被视为文本, 默认与文本的基线 baseline 对齐 -->
      <div v-for="(ceilsRow, y) of ceilsGrid" :key="y" class="flex">
        <button
          v-for="(ceil, x) of ceilsRow"
          :key="x"
          class="w-[50px] h-[50px] border-1 border-slate-700 hover:opacity-50 cursor-pointer flex justify-center items-center"
          :class="getCeilClass(ceil)"
          style="vertical-align: top"
          @click="handleClick(ceil)"
        >
          <template v-if="ceil.flipped">
            <div v-if="ceil.isMine">
              <MineSvg />
            </div>
            <div v-else>{{ ceil.adjacentMines }}</div>
          </template>
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss"></style>
