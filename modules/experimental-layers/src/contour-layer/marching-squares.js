// All utility mehtods needed to implement Marching Squres algorithm
// Ref: https://en.wikipedia.org/wiki/Marching_squares
import assert from 'assert';
const MarchingSquares = {
  getCode,
  getVertices
};

const OFFSET = {
  N: [0, 0.5],
  E: [0.5, 0],
  S: [0, -0.5],
  W: [-0.5, 0]
};

// Table to map code to the intersection offsets
// All offsets are relative to the center of marching cell (also top right corner of grid-cells)

// Note: the wiki page invertes white/black dots for generating the code, we don't
const CODE_OFFSET_MAP = {
  0: [],
  1: [[OFFSET.W, OFFSET.S]],
  2: [[OFFSET.S, OFFSET.E]],
  3: [[OFFSET.W, OFFSET.E]],
  4: [[OFFSET.N, OFFSET.E]],
  5: [[OFFSET.W, OFFSET.N], [OFFSET.S, OFFSET.E]],
  6: [[OFFSET.N, OFFSET.S]],
  7: [[OFFSET.W, OFFSET.N]],
  8: [[OFFSET.W, OFFSET.N]],
  9: [[OFFSET.N, OFFSET.S]],
  10: [[OFFSET.W, OFFSET.S], [OFFSET.N, OFFSET.E]],
  11: [[OFFSET.N, OFFSET.E]],
  12: [[OFFSET.W, OFFSET.E]],
  13: [[OFFSET.S, OFFSET.E]],
  14: [[OFFSET.W, OFFSET.S]],
  15: []
};

// Returns marching square code for given cell
/* eslint-disable max-params */
function getCode(params) {
  // Assumptions
  // Origin is on bottom-left , and X increase to right, Y to top
  // When processing one cell, we process 4 cell, by extending row to top and on col to right
  // to create a 2X2 cell grid

  const {gridWeights, thresholdValue, cellIndex, gridSize} = params;

  const numRows = gridSize[1];
  const numCols = gridSize[0];

  // We shouldn't process the last column
  assert((cellIndex + 1) % numCols);

  // We shouldn't process the topmost row
  assert(cellIndex + 1 < (numRows - 1) * numCols);

  const top = gridWeights[cellIndex + numCols] - thresholdValue > 0 ? 1 : 0;
  const topRight = gridWeights[cellIndex + numCols + 1] - thresholdValue > 0 ? 1 : 0;
  const right = gridWeights[cellIndex + 1] - thresholdValue > 0 ? 1 : 0;
  const current = gridWeights[cellIndex] - thresholdValue > 0 ? 1 : 0;

  // console.log(`top: ${top} topright: ${topRight} right: ${right} current: ${current}`);
  const code = (top << 3) | (topRight << 2) | (right << 1) | current;

  assert(code >= 0 && code < 16);

  return code;
}

// function getVertices(params) {
//   const {
//     gridOrigin,
//     cellIndex,
//     cellSize,
//     gridSize,
//     code
//   } = params;
//
//   const vertices = [];
//   const offsets = CODE_OFFSET_MAP[code];
//   // Reference vertex is top-right its co-ordinates are stored at index 0(X) and 1(Y)
//   const row = Math.floor(cellIndex / gridSize[0]);
//   const col = cellIndex - (row * gridSize[0]);
//
//   // Move to top-right corner
//   const rX = (col + 1) * cellSize[0];
//   const rY = (row + 1) * cellSize[1];
//
//   const refVertexX = gridOrigin[0] + rX;
//   const refVertexY = gridOrigin[1] + rY;
//
//
//   offsets.forEach((xyOffsets) => {
//     xyOffsets.forEach((offset) => {
//       vertices.push(refVertexX + offset[0] * cellSize[0]);
//       vertices.push(refVertexY + offset[1] * cellSize[1]);
//     });
//   });
//
//   return vertices;
// }

function getVertices(params) {
  const {gridOrigin, cellIndex, cellSize, gridSize, code} = params;

  const segments = [];
  const offsets = CODE_OFFSET_MAP[code];
  // Reference vertex is top-right its co-ordinates are stored at index 0(X) and 1(Y)
  const row = Math.floor(cellIndex / gridSize[0]);
  const col = cellIndex - row * gridSize[0];

  // Move to top-right corner
  const rX = (col + 1) * cellSize[0];
  const rY = (row + 1) * cellSize[1];

  const refVertexX = gridOrigin[0] + rX;
  const refVertexY = gridOrigin[1] + rY;

  offsets.forEach(xyOffsets => {
    xyOffsets.forEach(offset => {
      const x = refVertexX + offset[0] * cellSize[0];
      const y = refVertexY + offset[1] * cellSize[1];
      segments.push([x, y]);
    });
  });

  return segments;
}

export default MarchingSquares;
/* eslint-enable max-params */
