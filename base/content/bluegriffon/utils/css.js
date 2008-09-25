/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is BlueGriffon.
 *
 * The Initial Developer of the Original Code is
 * Disruptive Innovations SARL.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Daniel Glazman <daniel.glazman@disruptive-innovations.com>, Original author
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var CssUtils = {
	getStyleSheets: function CssUtils_getStyleSheets(aDoc)
	{
		return aDoc.styleSheets;
	},

  _enumerateStyleSheet: function CssUtils__enumerateStyleSheet(aSheet, aCallback)
  {
    aCallback(aSheet);
    var rules = aSheet.cssRules;
    for (var j = 0; j < rules.length; j++)
    {
      var rule = rules.item(j);
      switch (rule.type)
      {
      	case CSSRule.IMPORT_RULE:
      	  this._enumerateStyleSheet(rule.styleSheet, aCallback);
      	  break;
      	case CSSRule.MEDIA_RULE:
      	  this._enumerateStyleSheet(rule, aCallback);
      	  break;
      	default:
      	  break;
      }

    }
  },

  enumerateStyleSheets: function CssUtils_enumerateStyleSheets(aDocument, aCallback)
  {
  	var stylesheetsList = aDocument.styleSheets;
    for (var i = 0; i < stylesheetsList.length; i++)
    {
      var sheet = stylesheetsList.item(i);
      this._enumerateStyleSheet(sheet, aCallback);
    }
  },

  getComputedStyle: function CssUtils_getComputedStyle(aElt)
  {
  	return aElt.ownerDocument.defaultView.getComputedStyle(aElt, "");
  },

  findClassesInSelector: function CssUtils_findClassesInSelector(aSelector)
  {
    return aSelector.match( /\.-?([_a-z]|[\200-\377]|((\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?)|\\[^\r\n\f0-9a-f]))([_a-z0-9-]|[\200-\377]|((\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?)|\\[^\r\n\f0-9a-f]))*/g );
  },

  findIdsInSelector: function CssUtils_findClassesInSelector(aSelector)
  {
    return aSelector.match( /#-?([_a-z]|[\200-\377]|((\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?)|\\[^\r\n\f0-9a-f]))([_a-z0-9-]|[\200-\377]|((\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?)|\\[^\r\n\f0-9a-f]))*/g );
  },

  getCssHintsFromDocument: function CssUtils_getAllClassesFromDocument(aDocument, aDetector)
  {
    var classList = [];
  
    function enumerateClass(aSheet)
    {
      var cssRules = aSheet.cssRules;
      for (var i = 0; i < cssRules.length; i++)
      {
        var rule = cssRules.item(i);
        if (rule.type == CSSRule.STYLE_RULE)
        {
          var selectorText = rule.selectorText;
          var matches = aDetector(selectorText);
          if (matches)
            for (var j = 0; j < matches.length; j++)
              classList.push(matches[j].substr(1));
        }
      }
    }
  
    CssUtils.enumerateStyleSheets(aDocument, enumerateClass);

    return classList;
  },

  getAllClassesForDocument: function CssUtils_getAllClassesForDocument(aDocument)
  {
    return this.getCssHintsFromDocument(aDocument, this.findClassesInSelector);
  },

  getAllIdsForDocument: function CssUtils_getAllClassesForDocument(aDocument)
  {
    return this.getCssHintsFromDocument(aDocument, this.findIdsInSelector);
  }
};

