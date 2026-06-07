# jam-2d-movement

Exploring 2d game movement in web technology.

## Install Instructions

To view the demo, simply open the index.html file in your browser. Use W,A,S,D to move around.

Otherwise

- `npm install`
- `npm start`

## How It Works

The idea is simple. The "player" is fixed to the center of the viewport and does not move. The "map" is larger than the viewport, which has its overflow property set to "hidden" to occlude the rest of the map. When a movement input is received, the map itself is shifted in the opposite direction. This gives the illusion that the player is moving.

This demo relies on math and coordinate positioning as the backbone for it all, with the grid size as the foundation (it's 32px here). "Cells" are an abstraction of coordinate positions so a human can reason about them easier. A game object holds information about each cell, such as collision information. When movement happens, the attempted move is calculated from coordinate positions, translated into a cell name, and the corresponding game object property is checked.
