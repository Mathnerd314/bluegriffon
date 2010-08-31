Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/cssHelper.jsm");

var gMain = null;
var gCurrentElement = null;
var gInUtils;

function Startup()
{
  GetUIElements();

  gInUtils = Components.classes["@mozilla.org/inspector/dom-utils;1"]
              .getService(Components.interfaces.inIDOMUtils);

  if (window.top &&
      "NotifierUtils" in window.top)
    gMain = window.top;
  else if (window.top && window.top.opener &&
           "NotifierUtils" in window.top.opener)
    gMain = window.top.opener;

  if (!gMain)
    return;
  
  gMain.NotifierUtils.addNotifierCallback("selection",
                                          SelectionChanged,
                                          window);
  gMain.NotifierUtils.addNotifierCallback("tabClosed",
                                          Inspect,
                                          window);
  gMain.NotifierUtils.addNotifierCallback("tabCreated",
                                          Inspect,
                                          window);
  Inspect();
  if (gMain && gMain.EditorUtils &&
      gMain.EditorUtils.getCurrentEditor()) {
    var c = gMain.EditorUtils.getSelectionContainer();
    if (c)
      SelectionChanged(null, c.node, c.oneElementSelected)
  }
}

function Shutdown()
{
  if (gMain)
  {
	  gMain.NotifierUtils.removeNotifierCallback("selection",
			                                         SelectionChanged,
			                                         window);
    gMain.NotifierUtils.removeNotifierCallback("tabClosed",
                                               Inspect);
    gMain.NotifierUtils.removeNotifierCallback("tabCreated",
                                               Inspect);
  }
}

function Inspect()
{
  if (gMain && gMain.EditorUtils)
  {
    var editor = gMain.EditorUtils.getCurrentEditor();
    gDialog.mainBox.hidden = !editor;
  }
}

function SelectionChanged(aArgs, aElt, aOneElementSelected)
{
  gCurrentElement = aElt;

  deleteAllChildren(gDialog.classPickerPopup);
  gDialog.IDPicker.value = aElt.id;

  var item;
  for (var i = aElt.classList.length -1; i >= 0; i--) {
    var c = aElt.classList.item(i);
    item = gDialog.classPicker.appendItem(c, c);
  }
  if (item)
    gDialog.classPicker.selectedItem = item;

  for (var i = 0; i < gIniters.length; i++)
    gIniters[i](aElt);
}

function onCssPolicyChange(aElt)
{
  var cssPolicy = aElt.value;
  gDialog.classPicker.hidden = (cssPolicy !="class");
  gDialog.IDPicker.hidden = (cssPolicy !="id");
  if (cssPolicy == "class")
    gDialog.classPicker.focus();
  else if (cssPolicy == "id")
    gDialog.IDPicker.focus();
}

function ToggleSection(aImage)
{
  if (aImage.hasAttribute("style")) {
    aImage.removeAttribute("style");
    aImage.parentNode.nextSibling.hidden = true;
  }
  else {
	  aImage.setAttribute("style", "-moz-transform: rotate(0deg)");
	  aImage.parentNode.nextSibling.hidden = false;
  }
}

var gIniters = [];

function RegisterIniter(aFn)
{
  gIniters.push(aFn);
}

function GetComputedValue(aElt, aProperty)
{
  return aElt.ownerDocument.defaultView.getComputedStyle(aElt, "").getPropertyValue(aProperty);
}

function ApplyStyles(aStyles)
{
  for (var i = 0; i < aStyles.length; i++) {
    var s = aStyles[i];
    var property = s.property;
    var value = s.value;

	  switch (gDialog.cssPolicyMenulist.value) {

      case "inline":
        {
          var txn = new diStyleAttrChangeTxn(gCurrentElement, property, value, "");
          EditorUtils.getCurrentEditor().transactionManager.doTransaction(txn);  
        }
        break;

      case "class":
        {
          var editor = EditorUtils.getCurrentEditor();
          editor.beginTransaction();
          var rules = gInUtils.getCSSStyleRules(gCurrentElement);
          // user agent rules have parentStyleSheet.ownerNode
          var modifiedSheets = [];
          for (var j = 0; j < rules.Count(); j++) {
            var rule = rules.GetElementAt(j);
            if (rule.style.getPropertyValue(property)) {
              var sheet = rule.parentStyleSheet;
              modifiedSheets.push(sheet);
              rule.style.removeProperty(property);
              if (!rule.style.length)
                sheet.deleteRule(rule);
            }
          }
          for (var j = 0; j < modifiedSheets.length; j++)
            CssUtils.reserializeEmbeddedStylesheet(modifiedSheets[j], editor);

          if (value)
	          CssUtils.addRuleForSelector(editor,
                                        EditorUtils.getCurrentDocument(),
	                                      "." + gDialog.classPicker.value,
	                                      [
	                                        {
	                                          property: property,
	                                          value: value,
	                                          priority: false
	                                        }
	                                      ]);
          editor.endTransaction();
        }
        break;
      default:
        break;
	  }
    // reselect the element
    EditorUtils.getCurrentEditor().selectElement(gCurrentElement);
  }
}

function ToggleProperty(aElt)
{
  var checked   = aElt.hasAttribute("checked");
  var value     = checked ? aElt.getAttribute("value") : "";
  var property  = aElt.getAttribute("property");
  var resetter  = aElt.getAttribute("resetter");
  var group     = aElt.getAttribute("group");
  var agregator = aElt.getAttribute("agregator");
  var others = [];
  if (agregator)
    others = document.querySelectorAll("[agregator='" + agregator + "']");
  else if (group)
    others = document.querySelectorAll("[group='" + group + "']");
  for (var i = 0; i < others.length; i++) {
    var e = others[i];
    if (e != aElt) {
      if (resetter == "true" || group)
        e.removeAttribute("checked");
      else {
        if (agregator && e.hasAttribute("checked"))
          value += " " + e.getAttribute("value");
      }
    }
  }
  ApplyStyles([ { property: property, value: value} ]);
}

function CheckToggle(aToggle, aChecked)
{
  if (aChecked)
    aToggle.setAttribute("checked", "true");
  else
    aToggle.removeAttribute("checked");
}

#include general.js.inc
#include columns.js.inc
