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

var InContextHelper = {
  mDocument: null,

  hideInContextPanel: function()
  {
    if (this.mDocument) {
      this.mDocument.documentElement.removeEventListener("mousemove", InContextHelper.onMouseMove, true);
      this.mDocument.documentElement.removeEventListener("mouseleave", InContextHelper.onMouseLeave, true);
      this.mDocument = null;
    }
    gDialog.inContextStylePanel.hidePopup();
  },

  showInContextPanel: function(aElement) {
    var selectionRect = EditorUtils.getCurrentEditor().selection.getRangeAt(0).getBoundingClientRect();
    var elementRect = aElement.getBoundingClientRect();
    gDialog.inContextStylePanel.openPopup(aElement, "after_start",
                                          10,
                                          - elementRect.bottom + selectionRect.top - 80,
                                          false, true);
    this.mDocument = EditorUtils.getCurrentDocument();
    this.mDocument.documentElement.addEventListener("mousemove", InContextHelper.onMouseMove, true);
    this.mDocument.documentElement.addEventListener("mouseleave", InContextHelper.onMouseLeave, true);
    gDialog.inContextStylePanel.style.opacity = "";
  },

  onMouseLeave: function(aEvent) {
    //gDialog.inContextStylePanel.style.opacity = "0";
  },

  onMouseEnter: function(aEvent) {
    gDialog.inContextStylePanel.style.opacity = "1";
  },

  onMouseMove: function(aEvent) {
    if (gDialog.inContextStylePanel.state == "closed") // early way out if we can
      return;
  
    var panelBoxObject = gDialog.inContextStylePanel.boxObject;
    var panelRect = { left: panelBoxObject.screenX,
                      top: panelBoxObject.screenY,
                      right: panelBoxObject.screenX + panelBoxObject.width,
                      bottom: panelBoxObject.screenY + panelBoxObject.height };
    var x = aEvent.screenX;
    var y = aEvent.screenY;
    var distance = 0;
    if (x < panelRect.left) {
      if (y < panelRect.top)
        distance = Math.sqrt( (y - panelRect.top)*(y - panelRect.top) + (x - panelRect.left)*(x - panelRect.left));
      else if (y > panelRect.bottom)
        distance = Math.sqrt( (y - panelRect.bottom)*(y - panelRect.bottom) + (x - panelRect.left)*(x - panelRect.left));
      else
        distance = panelRect.left - x;
    }
    else if (x >= panelRect.left && x <= panelRect.right) {
      if (y < panelRect.top)
        distance = panelRect.top - y;
      else if (y > panelRect.bottom)
        distance = y - panelRect.bottom;
      else
        distance = 0;
    }
    else {
      if (y < panelRect.top)
        distance = Math.sqrt( (y - panelRect.top)*(y - panelRect.top) + (x - panelRect.right)*(x - panelRect.right));
      else if (y > panelRect.bottom)
        distance = Math.sqrt( (y - panelRect.bottom)*(y - panelRect.bottom) + (x - panelRect.right)*(x - panelRect.right));
      else
        distance = x - panelRect.right;
    }
  
    distance = Math.min(distance, 30);
    gDialog.inContextStylePanel.style.opacity = (1 - distance / 30);
  }
}
