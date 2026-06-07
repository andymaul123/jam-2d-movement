const viewportSize = 224;
const mapWidth = 384;
const mapHeight = 384;
const gridSize = 32;

const mapElement = document.getElementById("map");
const cellInfoElement = document.getElementById("current-cell");
const coordsInfoElement = document.getElementById("current-coordinates");
const viewportElement = document.getElementById("main");
const playerElement = document.getElementById("player");

const playerPositionDeltaTop = 96;
const playerPositionDeltaLeft = 96;
const mapOffsetTop = -64;
const mapOffsetLeft = -64;
const numberOfRows = mapWidth / gridSize; // 5, "aka size of a column"
const numberOfColumns = mapHeight / gridSize; // 5, aka "size of a row"

const mapCellData = {};

addEventListener("keydown", (event) => {});

onkeydown = (event) => {
  move(event.keyCode);
};

function setup() {
  mapElement.style.width = valueToPixels(mapWidth);
  mapElement.style.height = valueToPixels(mapHeight);
  mapElement.style.top = valueToPixels(mapOffsetTop);
  mapElement.style.left = valueToPixels(mapOffsetLeft);
  viewportElement.style.width = valueToPixels(viewportSize);
  viewportElement.style.height = valueToPixels(viewportSize);
  playerElement.style.width = valueToPixels(gridSize);
  playerElement.style.height = valueToPixels(gridSize);
  playerElement.style.top = valueToPixels(playerPositionDeltaTop);
  playerElement.style.left = valueToPixels(playerPositionDeltaLeft);

  createMapCellData();
  updateCellInfoOnScreen(getCurrentPosition());
}

function move(keyCode) {
  if (event.keyCode === 87 && !event.repeat) {
    console.log("Attempting to move up");
    if (canMove("up", getCurrentPosition())) {
      mapElement.style.top = `${parseFloat(mapElement.style.top) + gridSize}px`;
    }
  }
  if (event.keyCode === 68 && !event.repeat) {
    console.log("Attempting to move right");
    if (canMove("right", getCurrentPosition())) {
      mapElement.style.left = `${parseFloat(mapElement.style.left) - gridSize}px`;
    }
  }
  if (event.keyCode === 83 && !event.repeat) {
    console.log("Attempting to move down");
    if (canMove("down", getCurrentPosition())) {
      mapElement.style.top = `${parseFloat(mapElement.style.top) - gridSize}px`;
    }
  }
  if (event.keyCode === 65 && !event.repeat) {
    console.log("Attempting to move left");
    if (canMove("left", getCurrentPosition())) {
      mapElement.style.left = `${parseFloat(mapElement.style.left) + gridSize}px`;
    }
  }
  updateCellInfoOnScreen(getCurrentPosition());
}

function getCurrentPosition() {
  const currentPositionTop = Math.abs(
    parseFloat(mapElement.style.top) - playerPositionDeltaTop,
  );
  const currentPositionLeft = Math.abs(
    parseFloat(mapElement.style.left) - playerPositionDeltaLeft,
  );
  let currentCell = 1;

  if (currentPositionLeft) {
    currentCell += currentPositionLeft / gridSize;
  }
  if (currentPositionTop) {
    currentCell += (currentPositionTop / gridSize) * numberOfColumns;
  }

  return {
    cell: currentCell,
    coords: { left: currentPositionLeft, top: currentPositionTop },
  };
}

function convertCoordsToCell(left, top) {
  if (
    left < 0 ||
    top < 0 ||
    left > mapWidth - gridSize ||
    top > mapHeight - gridSize
  ) {
    return 0;
  }
  // Starts at 1 because grid is not zero-indexed. Could swap that if desired
  let computedCell = 1;

  if (left) {
    computedCell += left / gridSize;
  }
  if (top) {
    computedCell += (top / gridSize) * numberOfColumns;
  }

  return computedCell;
}

function updateCellInfoOnScreen(currentPosition) {
  cellInfoElement.innerText = currentPosition.cell;
  coordsInfoElement.innerText = `${currentPosition.coords.left},${currentPosition.coords.top}`;
}

function canMove(attemptedMove, currentPosition) {
  let attemptedCellNumber;
  if (attemptedMove === "up") {
    attemptedCellNumber = convertCoordsToCell(
      currentPosition.coords.left,
      currentPosition.coords.top - gridSize,
    );
  }
  if (attemptedMove === "right") {
    attemptedCellNumber = convertCoordsToCell(
      currentPosition.coords.left + gridSize,
      currentPosition.coords.top,
    );
  }
  if (attemptedMove === "down") {
    attemptedCellNumber = convertCoordsToCell(
      currentPosition.coords.left,
      currentPosition.coords.top + gridSize,
    );
  }
  if (attemptedMove === "left") {
    attemptedCellNumber = convertCoordsToCell(
      currentPosition.coords.left - gridSize,
      currentPosition.coords.top,
    );
  }
  console.log(
    `Current cell is ${currentPosition.cell} and attempted move is ${attemptedCellNumber}`,
  );

  // mapCellData object and accessors are done lazily so I don't have to stub out a lot of mock data.
  // This would all be changed in a real scenario

  // Is the destination cell in the map object
  if (!mapCellData[`cell_${attemptedCellNumber}`]) {
    console.log(`Out of bounds, cannot leave the map!`);
    return false;
  }
  // Cell has been marked with collision that player can't walk through
  if (mapCellData[`cell_${attemptedCellNumber}`]?.collision === true) {
    console.log(`Collision! Cannot enter cell ${attemptedCellNumber}`);
    return false;
  }

  return true;
}

function valueToPixels(value) {
  return `${value}px`;
}

// Mocking a game object
function createMapCellData() {
  for (let index = 0; index < numberOfColumns * numberOfRows; index++) {
    mapCellData[`cell_${index + 1}`] = { collision: false };
  }
  mapCellData[`cell_53`].collision = true;
  mapCellData[`cell_79`].collision = true;
}

// Init
setup();
