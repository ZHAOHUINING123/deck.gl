import MarchingSquares from './marching-squares';


export function generateContours({
  thresholds,
  colors,
  countsBuffer,
  gridSize,
  gridOrigin,
  cellSize
}) {

  const contourVertices = [];

  const gridWeights = countsBuffer.getData().filter((value, index) => {
    // filter every 4th element (count of the grid)
    return (index % 4 === 0);
  });

  thresholds.forEach((threshold, index) => {

    const numCols = gridSize[0];
    for (let cellIndex = 0; cellIndex < gridSize[0] * (gridSize[1] - 1); cellIndex++) {
      if (cellIndex === 0 || ((cellIndex + 1) % numCols) !== 0) {
        const code = MarchingSquares.getCode({
          gridWeights,
          thresholdValue: threshold,
          cellIndex,
          gridSize
        });

        const vertices = MarchingSquares.getVertices({
          gridOrigin: [0, 0], // gridVertices,
          cellIndex,
          cellSize,
          gridSize,
          code
        });

        contourVertices.push(vertices);
      }
    }
  });

  return [
    {
      path: contourVertices
    }
  ];
}
