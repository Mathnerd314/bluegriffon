Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/cssHelper.jsm");
Components.utils.import("resource://gre/modules/cssInspector.jsm");

var gMain = null;
var gCurrentElement = null;
var gInUtils;

function Startup()
{
  GetUIElements();

  InitLocalFontFaceMenu(gDialog.addFontMenupopup);

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

  var ruleset = CssInspector.getCSSStyleRules(aElt);
  for (var i = 0; i < gIniters.length; i++)
    gIniters[i](aElt, ruleset);
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
  var header = aImage.parentNode;
  if (header.hasAttribute("open")) {
    header.removeAttribute("open");
  }
  else {
	  header.setAttribute("open", "true");
  }
  document.persist(header.id, "open");
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

function PopulateLengths(aElt, aUnitsString)
{
  var menuseparator = aElt.querySelector("menuseparator");
  if (menuseparator) {
    var child = aElt.firstChild;
    while (child && child != menuseparator) {
      var tmp = child.nextSibling;
      aElt.removeChild(child);
      child = tmp;
    }
  }
  else
    deleteAllChildren(aElt);

  var v = parseFloat(aElt.parentNode.value);
  if (isNaN(v))
    v = 0;
  var unitsArray = aUnitsString.split(" ");
  unitsArray.forEach(function(aArrayElt, aIndex, aArray) {
    var menuitem = document.createElement("menuitem");
    menuitem.setAttribute("label", v + aArrayElt);
    menuitem.setAttribute("value", v + aArrayElt);
    aElt.insertBefore(menuitem, menuseparator);
  });
}

function IncreaseLength(aElt, aUnitsString)
{
  var value;
  if (aElt.selectedItem)
    value = aElt.selectedItem.value;
  else
    value = aElt.value;
  var units = aUnitsString.replace( / /g, "|");
  var r = new RegExp( "([+-]?[0-9]*\\.[0-9]+|[+-]?[0-9]+)(" + units + ")*", "");
  var match = value.match( r );
  if (match) {
    var unit = match[2];
    var v    = parseFloat(match[1]);
    switch (unit) {
      case "in":
      case "cm":
        v += 0.1;
        v = Math.round( v * 10) / 10;
        break;
      case "em":
      case "ex":
        v += 0.5;
        v = Math.round( v * 10) / 10;
        break;
      default:
        v += 1;
        break;
    }
    aElt.value = v + (unit ? unit : "");
    onLengthMenulistCommand(aElt, aUnitsString, '', false);
  }
}

function DecreaseLength(aElt, aUnitsString, aAllowNegative)
{
  var value;
  if (aElt.selectedItem)
    value = aElt.selectedItem.value;
  else
    value = aElt.value;
  var units = aUnitsString.replace( / /g, "|");
  var r = new RegExp( "([+-]?[0-9]*\\.[0-9]+|[+-]?[0-9]+)(" + units + ")*", "");
  var match = value.match( r );
  if (match) {
    var unit = match[2];
    var v    = parseFloat(match[1]);
    switch (unit) {
      case "in":
      case "cm":
        v -= 0.1;
        v = Math.round( v * 10) / 10;
        break;
      case "em":
      case "ex":
        v -= 0.5;
        v = Math.round( v * 10) / 10;
        break;
      default:
        v -= 1;
        break;
    }
    if (!aAllowNegative && v < 0)
      v = 0;
    aElt.value = v + (unit ? unit : "");
    onLengthMenulistCommand(aElt, aUnitsString, '', aAllowNegative);
  }
}

function onLengthMenulistCommand(aElt, aUnitsString, aIdentsString, aAllowNegative)
{
  var idents = aIdentsString.split(" ");
  var value;
  if (aElt.selectedItem)
    value = aElt.selectedItem.value;
  else
    value = aElt.value;
  var units = aUnitsString.replace( / /g, "|");
  var r = new RegExp( "([+-]?[0-9]*\\.[0-9]+|[+-]?[0-9]+)(" + units + ")*", "");
  var match = value.match( r );
  if (!value ||
      (match && !(!aAllowNegative && parseFloat(match[1]) < 0)) ||
      idents.indexOf(value) != -1) {
	  ApplyStyles([
	                {
	                  property: aElt.getAttribute("property"),
	                  value: value
	                }
	              ]);
  }
}

function InitLocalFontFaceMenu(menuPopup)
{
  // fill in the menu only once...
  var callingId = menuPopup.parentNode.id;

  if(!BlueGriffonVars.fontMenuOk)
    BlueGriffonVars.fontMenuOk = {};
  if (BlueGriffonVars.fontMenuOk[callingId])
    return;
  BlueGriffonVars.fontMenuOk[callingId ] = callingId ;

  if (!BlueGriffonVars.localFonts)
  {
    // Build list of all local fonts once per editor
    try 
    {
      var enumerator = Components.classes["@mozilla.org/gfx/fontenumerator;1"]
                                 .getService(Components.interfaces.nsIFontEnumerator);
      var localFontCount = { value: 0 }
      BlueGriffonVars.localFonts = enumerator.EnumerateAllFonts(localFontCount);
    }
    catch(e) { }
  }
  
  for (var i = 0; i < BlueGriffonVars.localFonts.length; ++i)
  {
    if (BlueGriffonVars.localFonts[i] != "")
    {
      var itemNode = document.createElementNS(BlueGriffonVars.kXUL_NS, "menuitem");
      itemNode.setAttribute("label", BlueGriffonVars.localFonts[i]);
      itemNode.setAttribute("value", BlueGriffonVars.localFonts[i]);
      itemNode.setAttribute("style", "font-family: " + BlueGriffonVars.localFonts[i]);
      menuPopup.appendChild(itemNode);
    }
  }
}

#include general.js.inc
#include columns.js.inc
