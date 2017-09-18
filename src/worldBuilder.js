'use strict';

function WorldBuilder() {
  this.worldBodies = [];
  this.preciousObjects = [];
  this.cacti = [];
  this.platformGrid = new PlatformGrid();
}

WorldBuilder.prototype.buildCompleteWorld = function () {
  this.buildPlatforms();
  this.createWorldBodies();
  this.nonPlatformBodies();
};

WorldBuilder.prototype.buildPlatforms = function () {
  this.platformGrid.buildPlatforms(worldOptions.gridColumns);
};

WorldBuilder.prototype.getPlatformGrid = function () {
  return this.platformGrid.getGrid();
};

WorldBuilder.prototype.getPreciousObjects = function () {
  return this.preciousObjects;
};

WorldBuilder.prototype.getCacti = function () {
  return this.cacti;
};

WorldBuilder.prototype.getFallenObjects = function () {
  return this.preciousObjects.filter(function (object) {
    return object.isOnFloor();
  });
};

WorldBuilder.prototype.fallenObjectPreciousness = function () {
  var sum = 0;
  this.getFallenObjects().forEach(function (object) {
    sum += object.preciousness;
  });
  return sum;
};

WorldBuilder.prototype.getTouchedCacti = function () {
  return this.cacti.filter(function (cactus) {
    return cactus.hasBeenTouched();
  });
};

WorldBuilder.prototype.touchedCactiSpikiness = function () {
  var sum = 0;
  this.getTouchedCacti().forEach(function (cactus) {
    sum += cactus.getSpikiness();
  });
  return sum;
};

WorldBuilder.prototype.createPreciousObjects = function (xCoordinate) {
  this.preciousObjects.push(new PreciousObject(xCoordinate, 0));
};

WorldBuilder.prototype.createCacti = function (xCoordinate) {
  this.cacti.push(new Cactus(xCoordinate, 0));
};

WorldBuilder.prototype.objectOnFloor = function (body) {
  this.preciousObjects.forEach(function (object) {
    if (object.getBody() === body) {
      object.fallen();
    }
  });
};

WorldBuilder.prototype.cactusTouched = function (body) {
  this.cacti.forEach(function (cactus) {
    if(cactus.getBody() === body) {
      cactus.playerTouch();
    }
  });
};

WorldBuilder.prototype.getWorldBodies = function () {
  return this.worldBodies;
};

WorldBuilder.prototype.createWorldBodies = function () {
  for (var i = 0; i < worldOptions.gridRows; i++) {
    for (var j = 0; j < worldOptions.gridColumns; j++) {
      this.platformBodies(i, j);
    }
  }
};

WorldBuilder.prototype.platformBodies = function (i, j) {
  var bWidth = worldOptions.platformWidth;
  var bHeight = worldOptions.platformHeight;
  if (this.getPlatformGrid()[i][j] === 1) {
    var y = (worldOptions.height - worldOptions.playerSize) - (i * bHeight);
    var x = j * bWidth - (bWidth/2);
    this.placeObjects(x);
    this.worldBodies.push(Matter.Bodies.rectangle(x, y, bWidth, bHeight, { isStatic: true,
                                                                           label: 'platform'}));
  }
};

WorldBuilder.prototype.nonPlatformBodies = function () {
  var builder = this;
  builder.preciousObjects.forEach(function (object) {
    builder.worldBodies.push(object.getBody());
  });
  builder.cacti.forEach(function (cactus) {
    builder.worldBodies.push(cactus.getBody());
  });
};

WorldBuilder.prototype.placeObjects = function (xCoordinate) {
  if (randomNumberGenerator(0, 2) === 1) {
    this.objectOrCactus(xCoordinate);
  }
};

WorldBuilder.prototype.objectOrCactus = function (xCoordinate) {
  if (randomNumberGenerator(0, 10) === 1) {
    this.createCacti(xCoordinate);
  } else {
    this.createPreciousObjects(xCoordinate);
  }
};

WorldBuilder.prototype.fallenPreciousObjectsRatio = function () {
  return (this.getFallenObjects().length / this.getPreciousObjects().length)
};
