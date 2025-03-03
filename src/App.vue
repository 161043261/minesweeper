<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { CeilState } from '@/types'
import CeilBtn from './components/CeilBtn.vue'
import { HEIGHT, WIDTH, DIRECTIONS } from './constants'

let mineGenerated = false

const ceilsGrid = ref<CeilState[][]>(
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
            flagged: false,
            mine: false,
            adjacentMines: 0,
          }
        },
      ),
  ),
)

function generateMines(initialCeil: CeilState) {
  for (const ceilsRow of ceilsGrid.value) {
    for (const ceil of ceilsRow) {
      if (initialCeil.x === ceil.x && initialCeil.y === ceil.y) {
        continue
      }
      ceil.mine = Math.random() < 0.2
    }
  }
  setAdjacentMines()
}

function expandZero(ceil: CeilState) {
  if (ceil.adjacentMines > 0) {
    return
  }
  getSiblings(ceil).forEach((item) => {
    if (item.flipped) {
      return
    }
    item.flipped = true
    expandZero(item)
  })
}

function setAdjacentMines() {
  ceilsGrid.value.forEach((ceilsRow /** , y */) => {
    ceilsRow.forEach((ceil /** , x */) => {
      if (ceil.mine) {
        return
      }
      ceil.adjacentMines += getSiblings(ceil).filter((item) => item.mine).length
    })
  })
}

function handleClick(ceil: CeilState) {
  ceil.flagged = false
  if (!mineGenerated) {
    generateMines(ceil)
    mineGenerated = true
  }
  ceil.flipped = true
  if (ceil.mine) {
    // console.log(ceilsGrid)
    alert('You failed')
    return
  }
  expandZero(ceil)
  // 检查左键
  // judger()
}

function handleContextMenu(ceil: CeilState) {
  if (ceil.flipped) {
    return
  }
  ceil.flagged = !ceil.flagged
  // 检查右键
  // judger()
}

function getSiblings(ceil: CeilState): CeilState[] {
  return DIRECTIONS.map(([dx, dy]) => {
    const x2 = ceil.x + dx
    const y2 = ceil.y + dy
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) {
      return null
    }
    return ceilsGrid.value[y2][x2]
  }).filter(Boolean) as CeilState[] // 过滤 null 值
}

function judger() {
  if (!mineGenerated) {
    return
  }

  const ceils = ceilsGrid.value.flat() // 数组拍平
  // console.log(ceils)
  if (ceils.every((ceil) => ceil.flipped || ceil.flagged)) {
    if (ceils.some((ceil) => ceil.flagged && !ceil.mine)) {
      alert('You lose')
    } else {
      alert('You win')
    }
  }
}

watchEffect(
  judger /** () => {
  judger()
} */,
)
</script>

<template>
  <main class="flex flex-col items-center justify-center h-dvh w-dvw">
    <h1 class="text-3xl text-slate-700">Minesweeper</h1>
    <div class="mt-[20px] border-1 border-slate-700">
      <!-- button: 行内块, 行内块元素被视为文本, 默认与文本的基线 baseline 对齐 -->
      <div v-for="(ceilsRow, y) of ceilsGrid" :key="y" class="flex">
        <CeilBtn
          :ceil="ceil"
          v-for="(ceil, x) of ceilsRow"
          :key="x"
          @click="handleClick(ceil)"
          @contextmenu.prevent="handleContextMenu(ceil)"
        >
        </CeilBtn>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss"></style>
