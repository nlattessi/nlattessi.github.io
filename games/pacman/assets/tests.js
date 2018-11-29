'use strict';

define('pac-man/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/pac-man.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/pac-man.js should pass ESLint\n\n5:8 - \'Level\' is defined but never used. (no-unused-vars)\n6:8 - \'Level2\' is defined but never used. (no-unused-vars)\n93:13 - \'screenPixelWidth\' is assigned a value but never used. (no-unused-vars)\n94:13 - \'screenPixelHeight\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('mixins/movement.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'mixins/movement.js should pass ESLint\n\n15:34 - Empty block statement. (no-empty)');
  });

  QUnit.test('mixins/shared-stuff.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mixins/shared-stuff.js should pass ESLint\n\n');
  });

  QUnit.test('models/ghost.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/ghost.js should pass ESLint\n\n56:66 - \'arr\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('models/level.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/level.js should pass ESLint\n\n62:23 - \'jQuery\' is not defined. (no-undef)');
  });

  QUnit.test('models/level2.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/level2.js should pass ESLint\n\n');
  });

  QUnit.test('models/pac.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/pac.js should pass ESLint\n\n');
  });

  QUnit.test('models/teleport-level.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/teleport-level.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });
});
define('pac-man/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('pac-man/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'pac-man/tests/helpers/start-app', 'pac-man/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };

  var resolve = Ember.RSVP.resolve;
});
define('pac-man/tests/helpers/resolver', ['exports', 'pac-man/resolver', 'pac-man/config/environment'], function (exports, _resolver, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };

  exports.default = resolver;
});
define('pac-man/tests/helpers/start-app', ['exports', 'pac-man/app', 'pac-man/config/environment'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('pac-man/tests/integration/components/pac-man-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('pac-man', 'Integration | Component | pac man', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "piHjqES7",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"pac-man\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "y0sRbPLr",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"pac-man\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('pac-man/tests/test-helper', ['pac-man/tests/helpers/resolver', 'ember-qunit', 'ember-cli-qunit'], function (_resolver, _emberQunit, _emberCliQunit) {
  'use strict';

  (0, _emberQunit.setResolver)(_resolver.default);
  (0, _emberCliQunit.start)();
});
define('pac-man/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/pac-man-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/pac-man-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
});
require('pac-man/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
