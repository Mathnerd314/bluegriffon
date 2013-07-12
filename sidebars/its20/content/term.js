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
 * The Original Code is ITS 2.0 Panel for BlueGriffon.
 *
 * The Initial Developer of the Original Code is
 * Disruptive Innovations SAS.
 * Portions created by the Initial Developer are Copyright (C) 2013
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Daniel Glazman <daniel.glazman@disruptive-innovations.com>, Original author
 *     on behalf of DFKI
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

Components.utils.import("resource://app/modules/cssHelper.jsm");
Components.utils.import("resource://app/modules/editorHelper.jsm");
Components.utils.import("resource://app/modules/l10nHelper.jsm");

RegisterResetter(TermSectionResetter, true);
RegisterIniter(TermSectionIniter, true);

function TermSectionResetter()
{
  gDialog.yesTermTerminologyButton.removeAttribute("checked");
  gDialog.noTermTerminologyButton.removeAttribute("checked");
  gDialog.termInfoRefMenulist.value = "";
  gDialog.termInfoRefCheckbox.checked = false;
  gDialog.termInfoRefMenulist.disabled = true;
  gDialog.termConfidenceCheckbox.checked = false;
  gDialog.termConfidenceScale.disabled = true;
  gDialog.termConfidenceTextbox.disabled = true;
}

function TermSectionIniter(aElt)
{
  var term = aElt.getAttribute("its-term");
  if (term == "yes" || term == "no") {
    gDialog.deleteTermRule.setAttribute("visible", "true");

    Toggle(gDialog.yesTermTerminologyButton, "yes" == term);
    Toggle(gDialog.noTermTerminologyButton,  "no"  == term);
  
    if (aElt.hasAttribute("its-term-info-ref")) {
      gDialog.termInfoRefCheckbox.checked = true;
      gDialog.termInfoRefMenulist.disabled = false;
      gDialog.termInfoRefMenulist.value = aElt.getAttribute("its-term-info-ref");
    }
    else {
      gDialog.termInfoRefCheckbox.checked = false;
      gDialog.termInfoRefMenulist.disabled = true;
    }
  
    if (aElt.hasAttribute("its-term-confidence")) {
      gDialog.termConfidenceCheckbox.checked = true;
      gDialog.termConfidenceScale.value = parseFloat(aElt.getAttribute("its-term-confidence")) * 100;
      gDialog.termConfidenceTextbox.value = parseFloat(aElt.getAttribute("its-term-confidence"));
      gDialog.termConfidenceScale.disabled = false;
      gDialog.termConfidenceTextbox.disabled = false;
    }
    else {
      gDialog.termConfidenceCheckbox.checked = false;
      gDialog.termConfidenceScale.disabled = true;
      gDialog.termConfidenceTextbox.disabled = true;
    }
  }
  else {
    gDialog.deleteTermRule.removeAttribute("visible");
  }
}

function ApplyTermChanges(e)
{
  if (e)
    e.parentNode.selectedItem = e.previousElementSibling

  var term = gDialog.yesTermTerminologyButton.hasAttribute("checked")
             ? "yes"
             : (gDialog.noTermTerminologyButton.hasAttribute("checked")
                ? "no"
                : "");
  if (term) {
    ApplyLocalITS( [
                     { property: "its-term", value: term },
                     { property: "its-term-info-ref", value: gDialog.termInfoRefCheckbox.checked
                                                             ? gDialog.termInfoRefMenulist.value.trim()
                                                             : "" },
                     { property: "its-term-confidence", value: gDialog.termConfidenceCheckbox.checked
                                                               ? gDialog.termConfidenceTextbox.value
                                                               : "" }
                   ]);
  }
  else {
    ApplyLocalITS( [
                     { property: "its-term", value: "" },
                     { property: "its-term-info-ref", value: "" },
                     { property: "its-term-confidence", value: "0" }
                   ]);
  }
}

function TermSectionDeleter()
{
  ApplyLocalITS( [
                   { property: "its-term", value: "" },
                   { property: "its-term-info-ref", value: "" },
                   { property: "its-term-confidence", value: "" }
                 ]);
  ReflowGlobalRulesInUI(gCurrentElement, true, ["termRule"]);
}

function TermConfidenceScaleChanged(e)
{
  if (gDialog.termConfidenceTextbox) {
    gDialog.termConfidenceTextbox.value = e.value / 100;
    ApplyTermChanges();
  }
}

function TermConfidenceTextboxChanged(e)
{
  if (gDialog.termConfidenceScale) {
    gDialog.termConfidenceScale.value = parseFloat(e.value) * 100;
    ApplyTermChanges();
  }
}

function onTermConfidenceToggled()
{
  var c = gDialog.termConfidenceCheckbox.checked;
  gDialog.termConfidenceScale.disabled = !c;
  gDialog.termConfidenceTextbox.disabled = !c;

  ApplyTermChanges();
}

function onTermInfoRefToggled()
{
  var c = gDialog.termInfoRefCheckbox.checked;
  gDialog.termInfoRefMenulist.disabled = !c;
  if (!gDialog.termInfoRefMenulist.value)
    gDialog.termInfoRefMenulist.valueOf() = " ";

  ApplyTermChanges();
}
