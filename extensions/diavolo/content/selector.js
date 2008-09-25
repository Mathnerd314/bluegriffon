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
 * The Original Code is Diavolo.
 *
 * The Initial Developer of the Original Code is
 * Disruptive Innovations SARL.
 * Portions created by the Initial Developer are Copyright (C) 2006-2008
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

function DiavoloSelector(aDiavoloEditor)
{
  this.init(aDiavoloEditor);
}

DiavoloSelector.prototype = {
  
  mDiavoloEditor: null,

  mSelecting: false,
  mStartOffset: -1,
  mEndOffset: -1,

  init: function init(aDiavoloEditor)
  {
    this.mDiavoloEditor = aDiavoloEditor;
  },

  selectLine: function selectLine(e)
  {
    if (!this.mDiavoloEditor)
      return;
    var node = e.originalTarget;
    if (node.localName.toLowerCase() != "pre")
      return;

    this.mSelecting = true;
    
    var line = parseInt(e.originalTarget.textContent);
    var startOffset = -1;
    var endOffset = -1;
    var offset = 0;
    var node = this.mDiavoloEditor.mHighlighter.mElement.firstChild;
    var currentLine = 1;
    while (currentLine <= line)
    {
      if (line == currentLine)
      {
        if (startOffset == -1)
          startOffset = offset;
        endOffset = offset;
      }
      if (node.nodeName.toLowerCase() == "br")
        currentLine++;

      node = node.nextSibling;
      offset++;

    }
    if (startOffset == -1 || endOffset == -1)
      return;

    if (this.mStartOffset == -1)
      this.mStartOffset = startOffset;

    this.mEndOffset = endOffset;

    if (this.mEndOffset >= this.mStartOffset)
    {
      startOffset = this.mStartOffset;
      endOffset = this.mEndOffset + 1;
    }
    else
    {
      startOffset = this.mEndOffset;
      endOffset = this.mStartOffset+1;
    }

    this.mDiavoloEditor.mEditorCore.selection.collapse(this.mDiavoloEditor.mHighlighter.mElement,
                                                       startOffset);
    this.mDiavoloEditor.mEditorCore.selection.extend(this.mDiavoloEditor.mHighlighter.mElement,
                                                       endOffset);
  },

  extendSelection: function extendSelection(e)
  {
    if (this.mSelecting)
      this.selectLine(e);
  },

  stopSelectLine: function stopSelectLine(e)
  {
    this.mSelecting = false;
    this.mStartOffset = -1;
    this.mEndOffset = -1;
  }

}
