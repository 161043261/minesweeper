export interface CeilState {
  x: number
  y: number
  flipped: boolean // 是否被翻开
  flagged: boolean // 是否被标记
  mine: boolean // 是否为炸弹
  adjacentMines: number // 相邻的炸弹数
}
