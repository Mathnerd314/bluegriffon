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

Components.utils.import("resource://app/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");

var InContextHelper = {

  mCancelNext: false,

  isInContextEnabled: function()
  {
    var inContextEnabled = false;
    try {
      inContextEnabled = Services.prefs.getBoolPref("bluegriffon.floatingToolbar.enabled");
    }
    catch(e) {}
    return inContextEnabled;
  },

  hideInContextPanel: function()
  {
    if (!this.isInContextEnabled())
      return;

    gDialog.inContextStylePanel.hidePopup();
  },

  cancelNextInContextPanel: function() {
    this.mCancelNext = true;
  },

  showInContextPanel: function(aElement) {
    if (gDialog.inContextStylePanel.state != "closed")
      this.hideInContextPanel();

    if (this.isInContextEnabled()) {
      var selectionRect = EditorUtils.getCurrentEditor().selection.getRangeAt(0).getBoundingClientRect();
      var elementRect = aElement.getBoundingClientRect();
      setTimeout(this._showInContextPanel, 1000, aElement, elementRect, selectionRect);
    }
  },

  _showInContextPanel: function(aElement, elementRect, selectionRect) {
    if (InContextHelper.mCancelNext) {
      InContextHelper.mCancelNext = false;
      return;
    }
    gDialog.inContextStylePanel.openPopup(aElement, "after_pointer",
                                          selectionRect.left - elementRect.left,
                                          (elementRect.top < 0) ?  -elementRect.top : selectionRect.top - elementRect.top,
                                          false, false);
  }
}