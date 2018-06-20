import MarchingSquares from './marching-squares';
import assert from 'assert';

export function generateContours({
  thresholds,
  colors,
  countsBuffer,
  gridSize,
  gridOrigin,
  cellSize
}) {

  const contourSegments = [];

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
          gridOrigin: [gridOrigin[0] - 180, gridOrigin[1] - 90], // gridVertices,
          cellIndex,
          cellSize,
          gridSize,
          code
        });
        // We should always get even number of vertices
        assert(vertices.length % 2 === 0);
        for (let i=0; i< vertices.length; i+=2) {
          contourSegments.push({
            start: vertices[i],
            end: vertices[i+1],
            threshold
          });
        }
      }
    }
  });
  // format: [ {start: , end: threshold: }, {start: , end: threshold: }, ...]
  return contourSegments;
}
