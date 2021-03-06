/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Defines DeferredTestCase class. By calling waitForDeferred(),
 * tests in DeferredTestCase can wait for a Deferred object to complete its
 * callbacks before continuing to the next test.
 *
 * Example Usage:
 *
 *   var deferredTestCase = goog.testing.DeferredTestCase.createAndInstall();
 *   // Optionally, set a longer-than-usual step timeout.
 *   deferredTestCase.stepTimeout = 15 * 1000; // 15 seconds
 *
 *   function testDeferredCallbacks() {
 *     var callbackTime = goog.now();
 *     var callbacks = new goog.async.Deferred();
 *     deferredTestCase.addWaitForAsync('Waiting for 1st callback', callbacks);
 *     callbacks.addCallback(
 *         function() {
 *           assertTrue(
 *               'We\'re going back in time!', goog.now() >= callbackTime);
 *           callbackTime = goog.now();
 *         });
 *     deferredTestCase.addWaitForAsync('Waiting for 2nd callback', callbacks);
 *     callbacks.addCallback(
 *         function() {
 *           assertTrue(
 *               'We\'re going back in time!', goog.now() >= callbackTime);
 *           callbackTime = goog.now();
 *         });
 *     deferredTestCase.addWaitForAsync('Waiting for last callback', callbacks);
 *     callbacks.addCallback(
 *         function() {
 *           assertTrue(
 *               'We\'re going back in time!', goog.now() >= callbackTime);
 *           callbackTime = goog.now();
 *         });
 *
 *     deferredTestCase.waitForDeferred(callbacks);
 *   }
 *
 * Note that DeferredTestCase still preserves the functionality of
 * AsyncTestCase.
 *
 * @see.goog.async.Deferred
 * @see goog.testing.AsyncTestCase
 */

goog.setTestOnly('goog.testing.DeferredTestCase');
goog.provide('goog.testing.DeferredTestCase');

goog.require('goog.async.Deferred');
goog.require('goog.testing.AsyncTestCase');
goog.require('goog.testing.TestCase');



/**
 * A test case that can asynchronously wait on a Deferred object.
 * @param {string=} opt_name A descriptive name for the test case.
 * @constructor
 * @extends {goog.testing.AsyncTestCase}
 * @deprecated Use goog.testing.TestCase instead. goog.testing.TestCase now
 *    supports async testing using promises.
 */
goog.testing.DeferredTestCase = function(opt_name) {
  'use strict';
  goog.testing.AsyncTestCase.call(this, opt_name);
};
goog.inherits(goog.testing.DeferredTestCase, goog.testing.AsyncTestCase);


/**
 * Preferred way of creating a DeferredTestCase. Creates one and initializes it
 * with the G_testRunner.
 * @param {string=} opt_name A descriptive name for the test case.
 * @return {!goog.testing.DeferredTestCase} The created DeferredTestCase.
 */
goog.testing.DeferredTestCase.createAndInstall = function(opt_name) {
  'use strict';
  var deferredTestCase = new goog.testing.DeferredTestCase(opt_name);
  goog.testing.TestCase.initializeTestRunner(deferredTestCase);
  return deferredTestCase;
};


/**
 * Handler for when the test produces an error.
 * @param {Error|string} err The error object.
 * @protected
 * @throws Always throws a ControlBreakingException.
 */
goog.testing.DeferredTestCase.prototype.onError = function(err) {
  'use strict';
  this.doAsyncError(err);
};


/**
 * Handler for when the test succeeds.
 * @protected
 */
goog.testing.DeferredTestCase.prototype.onSuccess = function() {
  'use strict';
  this.continueTesting();
};


/**
 * Adds a callback to update the wait message of this async test case. Using
 * this method generously also helps to document the test flow.
 * @param {string} msg The update wait status message.
 * @param {goog.async.Deferred} d The deferred object to add the waitForAsync
 *     callback to.
 * @see goog.testing.AsyncTestCase#waitForAsync
 */
goog.testing.DeferredTestCase.prototype.addWaitForAsync = function(msg, d) {
  'use strict';
  d.addCallback(goog.bind(this.waitForAsync, this, msg));
};


/**
 * Wires up given Deferred object to the test case, then starts the
 * goog.async.Deferred object's callback.
 * @param {string|!goog.async.Deferred} a The wait status message or the
 *     deferred object to wait for.
 * @param {goog.async.Deferred=} opt_b The deferred object to wait for.
 */
goog.testing.DeferredTestCase.prototype.waitForDeferred = function(a, opt_b) {
  'use strict';
  var waitMsg;
  var deferred;
  switch (arguments.length) {
    case 1:
      deferred = /** @type {!goog.async.Deferred} */ (a);
      waitMsg = null;
      break;
    case 2:
      deferred = /** @type {!goog.async.Deferred} */ (opt_b);
      waitMsg = a;
      break;
    default:  // Shouldn't be here in compiled mode
      throw new Error('Invalid number of arguments');
  }
  deferred.addCallbacks(this.onSuccess, this.onError, this);
  if (!waitMsg) {
    waitMsg = 'Waiting for deferred in ' + this.getCurrentStepName();
  }
  this.waitForAsync(/** @type {string} */ (waitMsg));
  deferred.callback(true);
};
