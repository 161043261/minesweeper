<script setup lang="ts">
import { reactive } from 'vue'
import MineSvg from './components/MineSvg.vue'

const WIDTH = 10
const HEIGHT = 10

interface CeilState {
  x: number
  y: number
  flipped?: boolean // 是否被翻开
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

const handleClick = (x: number, y: number) => {
  console.log(x, ' ', y)
}

const getCeilClass = (ceil: CeilState) => {
  return ceil.isMine ? 'text-red-500' : textColors[ceil.adjacentMines]
}

const textColors = [
  'text-transparent', // 0
  'text-[#A3D1C6]', // 1
  'text-[#A1E3F9]', // 2
  'text-[#578FCA]', // 3
  'text-[#3674B5]', // 4
  'text-[#B3D8A8]', // 5
  'text-[#A9B5DF]', //6
  'text-[#7886C7]', // 7
  'text-[#2D336B]', // 8
]
generateMines()
setAdjacentMines()
</script>

<template>
  <main class="flex flex-col items-center justify-center h-dvh w-dvw">
    <h1 class="text-slate-500 text-3xl">Minesweeper</h1>
    <div class="mt-[20px]">
      <!-- button: 行内块, 行内块元素被视为文本, 默认与文本的基线 baseline 对齐 -->
      <div v-for="(ceilsRow, y) of ceilsGrid" :key="y" class="flex">
        <button
          v-for="(ceil, x) of ceilsRow"
          :key="x"
          class="w-[50px] h-[50px] border-1 hover:bg-[#FBFFE4] cursor-pointer flex justify-center items-center border-slate-800"
          :class="getCeilClass(ceil)"
          style="vertical-align: top"
          @click="handleClick(x, y)"
        >
          <div v-if="ceil.isMine">
            <MineSvg />
          </div>
          <div v-else>{{ ceil.adjacentMines }}</div>
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
