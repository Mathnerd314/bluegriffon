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
 * The Original Code is Mozilla Communicator client code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 1998
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Pete Collins
 *   Brian King
 *   Daniel Glazman (glazman@disruptive-innovations.com), on behalf of Linspire Inc.
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the NPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the NPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var ColorUtils = {
  getDefaultBrowserColors: function()
  {
    var prefs = GetPrefs();
    var colors = { UseSysColors: true,
                   TextColor:0,
                   BackgroundColor:0,
                   LinkColor:0,
                   ActiveLinkColor:0 ,
                   VisitedLinkColor:0 };
    try { colors.UseSysColors = prefs.getBoolPref("browser.display.use_system_colors"); } catch (e) {}
  
    if (!colors.UseSysColors)
    {
      try { colors.TextColor = prefs.getCharPref("browser.display.foreground_color"); } catch (e) {}
  
      try { colors.BackgroundColor = prefs.getCharPref("browser.display.background_color"); } catch (e) {}
    }
    // Use OS colors for text and background if explicitly asked or pref is not set
    if (!colors.TextColor)
      colors.TextColor = "windowtext";
  
    if (!colors.BackgroundColor)
      colors.BackgroundColor = "window";
  
    colors.LinkColor = prefs.getCharPref("browser.anchor_color");
    colors.ActiveLinkColor = prefs.getCharPref("browser.active_color");
    colors.VisitedLinkColor = prefs.getCharPref("browser.visited_color");
  
    return colors;
  },

  getDocumentColors: function(aDocument)
  {
    var colors = { UseSysColors: true,
                   TextColor:0,
                   BackgroundColor:0,
                   LinkColor:0,
                   ActiveLinkColor:0 ,
                   VisitedLinkColor:0 };
    var editor  = EditorUtils.getCurrentEditor();
    var bodyElt = editor.rootElement;
    var doc     = editor.document;

    var dummyAnchor1 = doc.createElement("a");
    dummyAnchor1.setAttribute("href", "foo");
    var dummyAnchor1 = doc.createElement("a");
    dummyAnchor1.setAttribute("href", "foo");
  },

  getComputedColor: function(aElt)
  {
    
  }
};
