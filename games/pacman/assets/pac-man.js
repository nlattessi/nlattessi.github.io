"use strict";



define('pac-man/app', ['exports', 'pac-man/resolver', 'ember-load-initializers', 'pac-man/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('pac-man/components/pac-man', ['exports', 'ember-keyboard-shortcuts/mixins/component', 'pac-man/mixins/shared-stuff', 'pac-man/models/pac', 'pac-man/models/level', 'pac-man/models/level2', 'pac-man/models/teleport-level', 'pac-man/models/ghost'], function (exports, _component, _sharedStuff, _pac, _level, _level2, _teleportLevel, _ghost) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend(_component.default, _sharedStuff.default, {
        score: 0,
        levelNumber: 1,
        lives: 3,

        levels: [_teleportLevel.default],

        didInsertElement: function didInsertElement() {
            this.startNewLevel();
            this.loop();
        },
        startNewLevel: function startNewLevel() {
            var level = this.loadNewLevel();
            level.restart();
            this.set('level', level);

            var pac = _pac.default.create({
                level: level,
                x: level.get('startingPac.x'),
                y: level.get('startingPac.y')
            });
            this.set('pac', pac);

            var ghosts = level.get('startingGhosts').map(function (startingPosition) {
                return _ghost.default.create({
                    level: level,
                    x: startingPosition.x,
                    y: startingPosition.y,
                    pac: pac
                });
            });
            this.set('ghosts', ghosts);
        },
        loadNewLevel: function loadNewLevel() {
            var levelIndex = (this.get('levelNumber') - 1) % this.get('levels.length');
            var levelClass = this.get('levels')[levelIndex];

            return levelClass.create();
        },
        drawWall: function drawWall(x, y) {
            var ctx = this.get('ctx');
            var squareSize = this.get('level.squareSize');

            ctx.fillStyle = '#000';
            ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
        },
        drawGrid: function drawGrid() {
            var _this = this;

            var grid = this.get('level.grid');

            grid.forEach(function (row, rowIndex) {
                row.forEach(function (cell, columnIndex) {
                    if (cell === 1) {
                        _this.drawWall(columnIndex, rowIndex);
                    }

                    if (cell === 2) {
                        _this.drawPellet(columnIndex, rowIndex);
                    }

                    if (cell === 3) {
                        _this.drawPowerPallet(columnIndex, rowIndex);
                    }
                }, _this);
            }, this);
        },
        drawPellet: function drawPellet(x, y) {
            var radiusDivisor = 6;
            this.drawCircle(x, y, radiusDivisor, 'stopped');
        },
        drawPowerPallet: function drawPowerPallet(x, y) {
            var radiusDivisor = 4;
            this.drawCircle(x, y, radiusDivisor, 'stopped', 'green');
        },
        clearScreen: function clearScreen() {
            var ctx = this.get('ctx');
            var screenPixelWidth = this.get('level.width') * this.get('level.squareSize');
            var screenPixelHeight = this.get('level.height') * this.get('level.squareSize');

            ctx.clearRect(0, 0, this.get('level.pixelWidth'), this.get('level.pixelHeight'));
        },
        loop: function loop() {
            this.get('pac').move();
            this.get('ghosts').forEach(function (ghost) {
                return ghost.move();
            });

            this.processAnyPellets();

            this.clearScreen();
            this.drawGrid();
            this.get('pac').draw();
            this.get('ghosts').forEach(function (ghost) {
                return ghost.draw();
            });

            var ghostCollisions = this.detectGhostCollisions();
            if (ghostCollisions.length > 0) {
                if (this.get('pac.powerMode')) {
                    ghostCollisions.forEach(function (ghost) {
                        return ghost.retreat();
                    });
                } else {
                    this.decrementProperty('lives');
                    this.restart();
                }
            }

            Ember.run.later(this, this.loop, 1000 / 60);
        },
        processAnyPellets: function processAnyPellets() {
            var x = this.get('pac.x');
            var y = this.get('pac.y');
            var grid = this.get('level.grid');

            if (grid[y][x] === 2) {
                grid[y][x] = 0;
                this.incrementProperty('score');

                if (this.get('level').isComplete()) {
                    this.incrementProperty('levelNumber');
                    this.startNewLevel();
                }
            } else if (grid[y][x] === 3) {
                grid[y][x] = 0;
                this.set('pac.powerModeTime', this.get('pac.maxPowerModeTime'));
            }
        },
        detectGhostCollisions: function detectGhostCollisions() {
            var _this2 = this;

            return this.get('ghosts').filter(function (ghost) {
                return _this2.get('pac.x') === ghost.get('x') && _this2.get('pac.y') === ghost.get('y');
            });
        },
        restart: function restart() {
            if (this.get('lives') <= 0) {
                this.set('score', 0);
                this.set('lives', 3);
                this.set('levelNumber', 1);
                this.startNewLevel();
            }
            this.get('pac').restart();
            this.get('ghosts').forEach(function (ghost) {
                return ghost.restart();
            });
        },


        keyboardShortcuts: {
            up: function up() {
                this.set('pac.intent', 'up');
            },
            down: function down() {
                this.set('pac.intent', 'down');
            },
            left: function left() {
                this.set('pac.intent', 'left');
            },
            right: function right() {
                this.set('pac.intent', 'right');
            }
        }
    });
});
define('pac-man/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('pac-man/helpers/app-version', ['exports', 'pac-man/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    var versionOnly = hash.versionOnly || hash.hideSha;
    var shaOnly = hash.shaOnly || hash.hideVersion;

    var match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('pac-man/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('pac-man/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('pac-man/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'pac-man/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var name = void 0,
      version = void 0;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('pac-man/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('pac-man/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('pac-man/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('pac-man/initializers/export-application-global', ['exports', 'pac-man/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('pac-man/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('pac-man/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('pac-man/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("pac-man/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('pac-man/mixins/movement', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Mixin.create({
        x: null,
        y: null,
        level: null,
        direction: 'down',

        powerMode: Ember.computed.gt('powerModeTime', 0),
        powerModeTime: 0,
        maxPowerModeTime: 400,
        timers: ['powerModeTime'],

        move: function move() {
            if (this.get('removed')) {} else if (this.animationCompleted()) {
                this.finalizeMove();
                this.changeDirection();
            } else if (this.get('direction') === 'stopped') {
                this.changeDirection();
            } else {
                this.incrementProperty('frameCycle');
            }

            this.tickTimers();
        },
        animationCompleted: function animationCompleted() {
            return this.get('frameCycle') === this.get('framesPerMovement');
        },
        finalizeMove: function finalizeMove() {
            var direction = this.get('direction');
            this.set('x', this.nextCoordinate('x', direction));
            this.set('y', this.nextCoordinate('y', direction));

            this.set('frameCycle', 1);
        },
        pathBlockedInDirection: function pathBlockedInDirection(direction) {
            var cellTypeInDirection = this.cellTypeInDirection(direction);
            return Ember.isEmpty(cellTypeInDirection) || cellTypeInDirection === 1;
        },
        cellTypeInDirection: function cellTypeInDirection(direction) {
            var nextX = this.nextCoordinate('x', direction);
            var nextY = this.nextCoordinate('y', direction);

            return this.get('level.grid.' + nextY + '.' + nextX);
        },
        nextCoordinate: function nextCoordinate(coordinate, direction) {
            var next = this.get(coordinate) + this.get('directions.' + direction + '.' + coordinate);

            if (this.get('level.teleport')) {
                if (direction === 'up' || direction === 'down') {
                    return this.modulo(next, this.get('level.height'));
                } else {
                    return this.modulo(next, this.get('level.width'));
                }
            } else {
                return next;
            }
        },
        modulo: function modulo(num, mod) {
            return (num + mod) % mod;
        },
        tickTimers: function tickTimers() {
            var _this = this;

            this.get('timers').forEach(function (timerName) {
                if (_this.get(timerName) > 0) {
                    _this.decrementProperty(timerName);
                }
            });
        }
    });
});
define("pac-man/mixins/shared-stuff", ["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Mixin.create({
        frameCycle: 1,
        framesPerMovement: 30,

        ctx: Ember.computed(function () {
            var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");
            return ctx;
        }),

        drawCircle: function drawCircle(x, y, radiusDivisor, direction) {
            var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '#000';

            var ctx = this.get('ctx');
            var squareSize = this.get('level.squareSize');

            var pixelX = (x + 1 / 2 + this.offsetFor('x', direction)) * squareSize;
            var pixelY = (y + 1 / 2 + this.offsetFor('y', direction)) * squareSize;

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(pixelX, pixelY, squareSize / radiusDivisor, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
        },
        offsetFor: function offsetFor(coordinate, direction) {
            var frameRatio = this.get('frameCycle') / this.get('framesPerMovement');
            return this.get("directions." + direction + "." + coordinate) * frameRatio;
        },


        directions: {
            'up': { x: 0, y: -1 },
            'down': { x: 0, y: 1 },
            'left': { x: -1, y: 0 },
            'right': { x: 1, y: 0 },
            'stopped': { x: 0, y: 0 }
        }
    });
});
define('pac-man/models/ghost', ['exports', 'pac-man/mixins/shared-stuff', 'pac-man/mixins/movement'], function (exports, _sharedStuff, _movement) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    exports.default = Ember.Object.extend(_sharedStuff.default, _movement.default, {
        // removed: false,
        removed: Ember.computed.gt('retreatTime', 0),
        retreatTime: 0,
        maxRetreatTime: 500,
        timers: ['retreatTime'],

        color: Ember.computed('retreatTime', function () {
            var timerPercentage = this.get('retreatTime') / this.get('maxRetreatTime');
            var retreated = { r: 0, g: 0, b: 0 };
            var normal = { r: 100, g: 40, b: 40 };

            var _map = ['r', 'g', 'b'].map(function (rgbSelector) {
                var color = retreated[rgbSelector] * timerPercentage + normal[rgbSelector] * (1 - timerPercentage);
                return Math.round(color);
            }),
                _map2 = _slicedToArray(_map, 3),
                r = _map2[0],
                g = _map2[1],
                b = _map2[2];

            return 'rgb(' + r + '%,' + g + '%,' + b + '%)';
        }),

        draw: function draw() {
            var x = this.get('x');
            var y = this.get('y');
            var radiusDivisor = 2;
            this.drawCircle(x, y, radiusDivisor, this.get('direction'), this.get('color'));
        },
        changeDirection: function changeDirection() {
            var _this = this;

            var directions = ['left', 'right', 'up', 'down'];
            var directionWeights = directions.map(function (direction) {
                return _this.chanceOfPacmanIfInDirection(direction);
            });

            var bestDirection = this.getRandomItem(directions, directionWeights);

            this.set('direction', bestDirection);
        },
        chanceOfPacmanIfInDirection: function chanceOfPacmanIfInDirection(direction) {
            if (this.pathBlockedInDirection(direction)) {
                return 0;
            } else {
                var desirabilityOfDirection = (this.get('pac.y') - this.get('y')) * this.get('directions.' + direction + '.y') + (this.get('pac.x') - this.get('x')) * this.get('directions.' + direction + '.x');

                if (this.get('pac.powerMode')) {
                    desirabilityOfDirection *= -1;
                }

                return Math.max(desirabilityOfDirection, 0) + 0.2;
            }
        },
        getRandomItem: function getRandomItem(list, weight) {
            var total_weight = weight.reduce(function (prev, cur, i, arr) {
                return prev + cur;
            });

            var random_num = Math.random() * total_weight;
            var weight_sum = 0;

            for (var i = 0; i < list.length; i++) {
                weight_sum += weight[i];
                weight_sum = Number(weight_sum.toFixed(2));

                if (random_num < weight_sum) {
                    return list[i];
                }
            }
        },
        init: function init() {
            this.set('startingX', this.get('x'));
            this.set('startingY', this.get('y'));

            return this._super.apply(this, arguments);
        },
        restart: function restart() {
            this.set('x', this.get('startingX'));
            this.set('y', this.get('startingY'));
            this.set('frameCycle', 0);
            this.set('direction', 'stopped');
        },
        retreat: function retreat() {
            this.set('retreatTime', this.get('maxRetreatTime'));

            this.set('removed', true);
            this.set('frameCycle', 0);
            this.set('x', this.get('level.ghostRetreat.x'));
            this.set('y', this.get('level.ghostRetreat.y'));
        }
    });
});
define('pac-man/models/level', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Object.extend({
        // 0 is a blank space
        // 1 is a wall
        // 2 is a pellet
        layout: [[2, 2, 2, 2, 2, 2, 2, 1], [2, 1, 2, 1, 2, 2, 2, 1], [2, 2, 1, 2, 2, 2, 2, 1], [2, 2, 2, 2, 2, 2, 2, 1], [2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 1]],
        squareSize: 40,
        startingPac: {
            x: 2,
            y: 0
        },
        startingGhosts: [{
            x: 0,
            y: 0
        }, {
            x: 5,
            y: 0
        }],
        teleport: true,
        ghostRetreat: {
            x: -1,
            y: -1
        },

        width: Ember.computed(function () {
            return this.get('grid.firstObject.length');
        }),
        height: Ember.computed(function () {
            return this.get('grid.length');
        }),
        pixelWidth: Ember.computed(function () {
            return this.get('width') * this.get('squareSize');
        }),
        pixelHeight: Ember.computed(function () {
            return this.get('height') * this.get('squareSize');
        }),

        isComplete: function isComplete() {
            var hasPelletsLeft = false;
            var grid = this.get('grid');

            grid.forEach(function (row) {
                row.forEach(function (cell) {
                    if (cell === 2) {
                        hasPelletsLeft = true;
                    }
                });
            });

            return !hasPelletsLeft;
        },
        restart: function restart() {
            var newGrid = jQuery.extend(true, [], this.get('layout'));
            this.set('grid', newGrid);
            // let grid = this.get('grid');
            // grid.forEach((row, rowIndex) => {
            //     row.forEach((cell, columnIndex) => {
            //         if (cell === 0) {
            //             grid[rowIndex][columnIndex] = 2;
            //         }
            //     });
            // });
        }
    });
});
define('pac-man/models/level2', ['exports', 'pac-man/models/level'], function (exports, _level) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _level.default.extend({
        layout: [[2, 2, 2, 2, 2, 2, 2, 2, 2], [2, 1, 1, 2, 1, 2, 1, 1, 2], [2, 1, 2, 2, 2, 2, 2, 1, 2], [2, 2, 2, 1, 1, 1, 2, 2, 2], [2, 1, 2, 2, 2, 2, 2, 1, 2], [2, 1, 1, 2, 1, 2, 1, 1, 2], [2, 2, 2, 2, 2, 2, 2, 2, 2]],
        squareSize: 60,
        startingPac: {
            x: 0,
            y: 3
        },
        startingGhosts: [{
            x: 0,
            y: 0
        }, {
            x: 5,
            y: 0
        }]
    });
});
define('pac-man/models/pac', ['exports', 'pac-man/mixins/shared-stuff', 'pac-man/mixins/movement'], function (exports, _sharedStuff, _movement) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    exports.default = Ember.Object.extend(_sharedStuff.default, _movement.default, {
        direction: 'down',
        intent: 'down',
        //powerMode: false,

        color: Ember.computed('powerModeTime', function () {
            var timerPercentage = this.get('powerModeTime') / this.get('maxPowerModeTime');
            var powered = { r: 60, g: 100, b: 0 };
            var normal = { r: 100, g: 95, b: 0 };

            var _map = ['r', 'g', 'b'].map(function (rgbSelector) {
                var color = powered[rgbSelector] * timerPercentage + normal[rgbSelector] * (1 - timerPercentage);
                return Math.round(color);
            }),
                _map2 = _slicedToArray(_map, 3),
                r = _map2[0],
                g = _map2[1],
                b = _map2[2];

            return 'rgb(' + r + '%,' + g + '%,' + b + '%)';
        }),

        restart: function restart() {
            this.set('x', this.get('level.startingPac.x'));
            this.set('y', this.get('level.startingPac.y'));
            this.set('frameCycle', 0);
            this.set('direction', 'stopped');
        },
        draw: function draw() {
            var x = this.get('x');
            var y = this.get('y');
            var radiusDivisor = 2;
            this.drawCircle(x, y, radiusDivisor, this.get('direction'), this.get('color'));
        },
        changeDirection: function changeDirection() {
            var intent = this.get('intent');
            if (this.pathBlockedInDirection(intent)) {
                this.set('direction', 'stopped');
            } else {
                this.set('direction', intent);
            }
        }
    });
});
define('pac-man/models/teleport-level', ['exports', 'pac-man/models/level'], function (exports, _level) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _level.default.extend({
        layout: [[1, 1, 1, 2, 1, 1, 1, 1, 1], [1, 2, 2, 2, 2, 2, 2, 1, 1], [1, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 1, 1, 1, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 1, 2, 1, 2, 1, 2, 1], [1, 3, 2, 2, 2, 2, 2, 2, 1], [1, 1, 1, 2, 1, 1, 1, 1, 1]],
        ghostRetreat: {
            x: 4,
            y: 3
        }
    });
});
define('pac-man/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('pac-man/router', ['exports', 'pac-man/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {});

  exports.default = Router;
});
define('pac-man/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define("pac-man/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "VJuQu0S7", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"pac-man\"],false]],\"hasEval\":false}", "meta": { "moduleName": "pac-man/templates/application.hbs" } });
});
define("pac-man/templates/components/pac-man", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ImeiytuM", "block": "{\"symbols\":[],\"statements\":[[6,\"canvas\"],[9,\"id\",\"myCanvas\"],[10,\"width\",[20,[\"level\",\"pixelWidth\"]],null],[10,\"height\",[20,[\"level\",\"pixelHeight\"]],null],[7],[8],[0,\"\\n\"],[6,\"br\"],[7],[8],[0,\"\\nScore: \"],[1,[18,\"score\"],false],[0,\"       Level: \"],[1,[18,\"levelNumber\"],false],[0,\"       Lives: \"],[1,[18,\"lives\"],false],[0,\"      \\n\"],[4,\"if\",[[19,0,[\"pac\",\"powerMode\"]]],null,{\"statements\":[[0,\"  PowerMode: \"],[1,[20,[\"pac\",\"powerModeTime\"]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "pac-man/templates/components/pac-man.hbs" } });
});


define('pac-man/config/environment', ['ember'], function(Ember) {
  var prefix = 'pac-man';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("pac-man/app")["default"].create({"name":"pac-man","version":"0.0.0+29ba6331"});
}
//# sourceMappingURL=pac-man.map
