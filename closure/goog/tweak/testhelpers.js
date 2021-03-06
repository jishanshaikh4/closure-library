/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Common test functions for tweak unit tests.
 *
 * @package
 */

goog.provide('goog.tweak.testhelpers');

goog.setTestOnly();

goog.require('goog.tweak');
goog.require('goog.tweak.BooleanGroup');
goog.require('goog.tweak.BooleanInGroupSetting');
goog.require('goog.tweak.BooleanSetting');
goog.require('goog.tweak.ButtonAction');
goog.require('goog.tweak.NumericSetting');
goog.require('goog.tweak.Registry');
goog.require('goog.tweak.StringSetting');


var boolEntry;
var boolEntry2;
var strEntry;
var strEntry2;
var strEnumEntry;
var numEntry;
var numEnumEntry;
var boolGroup;
var boolOneEntry;
var boolTwoEntry;
var buttonEntry;


/**
 * Creates a registry with some entries in it.
 * @param {string} queryParams The query parameter string to use for the
 *     registry.
 * @suppress {accessControls} Private state is accessed for test purposes.
 */
function createRegistryEntries(queryParams) {
  // Initialize the registry with the given query string.
  var registry = new goog.tweak.Registry(queryParams);
  goog.tweak.registry_ = registry;

  boolEntry = new goog.tweak.BooleanSetting('Bool', 'The bool1');
  registry.register(boolEntry);

  boolEntry2 = new goog.tweak.BooleanSetting('Bool2', 'The bool2');
  boolEntry2.setDefaultValue(true);
  registry.register(boolEntry2);

  strEntry = new goog.tweak.StringSetting('Str', 'The str1');
  strEntry.setParamName('s');
  registry.register(strEntry);

  strEntry2 = new goog.tweak.StringSetting('Str2', 'The str2');
  strEntry2.setDefaultValue('foo');
  registry.register(strEntry2);

  strEnumEntry = new goog.tweak.StringSetting('Enum', 'The enum');
  strEnumEntry.setValidValues(['A', 'B', 'C']);
  strEnumEntry.setRestartRequired(false);
  registry.register(strEnumEntry);

  numEntry = new goog.tweak.NumericSetting('Num', 'The num');
  numEntry.setDefaultValue(99);
  registry.register(numEntry);

  numEnumEntry = new goog.tweak.NumericSetting('Enum2', 'The 2nd enum');
  numEnumEntry.setValidValues([1, 2, 3]);
  numEnumEntry.setRestartRequired(false);
  numEnumEntry.label = 'Enum the second&';
  registry.register(numEnumEntry);

  boolGroup = new goog.tweak.BooleanGroup('BoolGroup', 'The bool group');
  registry.register(boolGroup);

  boolOneEntry =
      new goog.tweak.BooleanInGroupSetting('BoolOne', 'Desc for 1', boolGroup);
  boolOneEntry.setToken('B1');
  boolOneEntry.setRestartRequired(false);
  boolGroup.addChild(boolOneEntry);
  registry.register(boolOneEntry);

  boolTwoEntry =
      new goog.tweak.BooleanInGroupSetting('BoolTwo', 'Desc for 2', boolGroup);
  boolTwoEntry.setDefaultValue(true);
  boolGroup.addChild(boolTwoEntry);
  registry.register(boolTwoEntry);

  buttonEntry = new goog.tweak.ButtonAction('Button', 'The Btn', () => {});
  buttonEntry.label = '<btn>';
  registry.register(buttonEntry);

  var nsBoolGroup =
      new goog.tweak.BooleanGroup('foo.bar.BoolGroup', 'Namespaced Bool Group');
  registry.register(nsBoolGroup);
  var nsBool = new goog.tweak.BooleanInGroupSetting(
      'foo.bar.BoolOne', 'Desc for Namespaced 1', nsBoolGroup);
  nsBoolGroup.addChild(nsBool);
  registry.register(nsBool);
}
