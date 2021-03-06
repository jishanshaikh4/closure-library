/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview A control for representing a palette of colors, that the user
 * can highlight or select via the keyboard or the mouse.
 */

goog.provide('goog.ui.ColorPalette');

goog.require('goog.color');
goog.require('goog.dom.TagName');
goog.require('goog.style');
goog.require('goog.ui.Palette');
goog.require('goog.ui.PaletteRenderer');
goog.requireType('goog.dom.DomHelper');



/**
 * A color palette is a grid of color swatches that the user can highlight or
 * select via the keyboard or the mouse.  The selection state of the palette is
 * controlled by a selection model.  When the user makes a selection, the
 * component fires an ACTION event.  Event listeners may retrieve the selected
 * color using the {@link #getSelectedColor} method.
 *
 * @param {Array<string>=} opt_colors Array of colors in any valid CSS color
 *     format.
 * @param {goog.ui.PaletteRenderer=} opt_renderer Renderer used to render or
 *     decorate the palette; defaults to {@link goog.ui.PaletteRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @constructor
 * @extends {goog.ui.Palette}
 */
goog.ui.ColorPalette = function(opt_colors, opt_renderer, opt_domHelper) {
  'use strict';
  /**
   * Array of colors to show in the palette.
   * @type {Array<string>}
   * @private
   */
  this.colors_ = opt_colors || [];

  goog.ui.Palette.call(
      this, null, opt_renderer || goog.ui.PaletteRenderer.getInstance(),
      opt_domHelper);

  // Set the colors separately from the super call since we need the correct
  // DomHelper to be initialized for this class.
  this.setColors(this.colors_);
};
goog.inherits(goog.ui.ColorPalette, goog.ui.Palette);


/**
 * Array of normalized colors. Initialized lazily as often never needed.
 * @type {?Array<string>}
 * @private
 */
goog.ui.ColorPalette.prototype.normalizedColors_ = null;


/**
 * Array of labels for the colors. Will be used for the tooltips and
 * accessibility.
 * @type {?Array<string>}
 * @private
 */
goog.ui.ColorPalette.prototype.labels_ = null;


/**
 * Returns the array of colors represented in the color palette.
 * @return {Array<string>} Array of colors.
 */
goog.ui.ColorPalette.prototype.getColors = function() {
  'use strict';
  return this.colors_;
};

/**
 * Returns the array of tooltip labels for the colors in the color palette.
 * @return {?Array<string>} Array of labels.
 * @protected
 * @final
 */
goog.ui.ColorPalette.prototype.getLabels = function() {
  'use strict';
  return this.labels_;
};

/**
 * Sets the colors that are contained in the palette.
 * @param {Array<string>} colors Array of colors in any valid CSS color format.
 * @param {Array<string>=} opt_labels The array of labels to be used as
 *        tooltips. When not provided, the color value will be used.
 */
goog.ui.ColorPalette.prototype.setColors = function(colors, opt_labels) {
  'use strict';
  this.colors_ = colors;
  this.labels_ = opt_labels || null;
  this.normalizedColors_ = null;
  this.setContent(this.createColorNodes());
};


/**
 * @return {?string} The current selected color in hex, or null.
 */
goog.ui.ColorPalette.prototype.getSelectedColor = function() {
  'use strict';
  var selectedItem = /** @type {Element} */ (this.getSelectedItem());
  if (selectedItem) {
    var color = goog.style.getStyle(selectedItem, 'background-color');
    return goog.ui.ColorPalette.parseColor_(color);
  } else {
    return null;
  }
};


/**
 * Sets the selected color.  Clears the selection if the argument is null or
 * can't be parsed as a color.
 * @param {?string} color The color to set as selected; null clears the
 *     selection.
 */
goog.ui.ColorPalette.prototype.setSelectedColor = function(color) {
  'use strict';
  var hexColor = goog.ui.ColorPalette.parseColor_(color);
  if (!this.normalizedColors_) {
    this.normalizedColors_ = this.colors_.map(function(color) {
      'use strict';
      return goog.ui.ColorPalette.parseColor_(color);
    });
  }
  this.setSelectedIndex(
      hexColor ? this.normalizedColors_.indexOf(hexColor) : -1);
};


/**
 * @return {!Array<!Node>} An array of DOM nodes for each color.
 * @protected
 */
goog.ui.ColorPalette.prototype.createColorNodes = function() {
  'use strict';
  return this.colors_.map(function(color, index) {
    'use strict';
    var swatch = this.getDomHelper().createDom(goog.dom.TagName.DIV, {
      'class': goog.getCssName(this.getRenderer().getCssClass(), 'colorswatch'),
      'style': 'background-color:' + color
    });
    if (this.labels_ && this.labels_[index]) {
      swatch.title = this.labels_[index];
    } else {
      swatch.title = color.charAt(0) == '#' ?
          'RGB (' + goog.color.hexToRgb(color).join(', ') + ')' :
          color;
    }
    return swatch;
  }, this);
};


/**
 * Takes a string, attempts to parse it as a color spec, and returns a
 * normalized hex color spec if successful (null otherwise).
 * @param {?string} color String possibly containing a color spec; may be null.
 * @return {?string} Normalized hex color spec, or null if the argument can't
 *     be parsed as a color.
 * @private
 */
goog.ui.ColorPalette.parseColor_ = function(color) {
  'use strict';
  if (color) {
    try {
      return goog.color.parse(color).hex;
    } catch (ex) {
      // Fall through.
    }
  }
  return null;
};
