Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/cssHelper.jsm");
Components.utils.import("resource://gre/modules/cssInspector.jsm");
Components.utils.import("resource://gre/modules/prompterHelper.jsm");

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
  if (aElt == gCurrentElement)
    return;

  gCurrentElement = aElt;

  deleteAllChildren(gDialog.classPickerPopup);
  gDialog.classPickerPopup.value =  "";

  var item;
  for (var i = aElt.classList.length -1; i >= 0; i--) {
    var c = aElt.classList.item(i);
    item = gDialog.classPicker.appendItem(c, c);
  }
  if (item)
    gDialog.classPicker.selectedItem = item;

  var ruleset = CssInspector.getCSSStyleRules(aElt, false);
  for (var i = 0; i < gIniters.length; i++)
    gIniters[i](aElt, ruleset);

  gDialog.currentElementBox.setAttribute("value",
       "<" + gCurrentElement.nodeName.toLowerCase() +
       (gCurrentElement.id ? " id='" + gCurrentElement.id + "'" : "") +
       (gCurrentElement.className ? " class='" + gCurrentElement.className + "'" : "") +
       ">" +
       gCurrentElement.innerHTML.substr(0, 100));
}

function onCssPolicyChange(aElt)
{
  var cssPolicy = aElt.value;
  gDialog.classPicker.hidden = (cssPolicy !="class");
  if (cssPolicy == "class")
    gDialog.classPicker.focus();
}

function ToggleSection(header)
{
  var section = header.nextElementSibling;
  if (header.hasAttribute("open")) {
    section.style.height = "0px";
    header.removeAttribute("open");
  }
  else {
    section.style.height = "";
    header.setAttribute("open", "true");
    section.style.height = document.defaultView.getComputedStyle(section, "").getPropertyValue("height");
  }
  document.persist(header.id, "open");
  document.persist(section.id, "style");
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

var gSavedSelection;
function SaveSelection()
{
  var editor = EditorUtils.getCurrentEditor();
  var selection = editor.selection;
  gSavedSelection = [];
  for (var i = 0; i < selection.rangeCount; i++) {
    var r = selection.getRangeAt(i);
    gSavedSelection.push( {
                            startContainer: r.startContainer,
                           startOffset   : r.startOffset,
                           endContainer  : r.endContainer,
                           endOffset     : r.endOffset
                         });
  }
}

function RestoreSelection()
{
  if (!gSavedSelection)
    return;
  var editor = EditorUtils.getCurrentEditor();
  var selection = editor.selection;
  selection.removeAllRanges();
  for (var i = 0 ; i < gSavedSelection.length; i++) {
    var s = gSavedSelection[i];
    var range = document.createRange();
    range.setStart(s.startContainer, s.startOffset);
    range.setEnd(s.endContainer, s.endOffset);
    selection.addRange(range);
  }
  // don't preserve a reference to nodes !
  gSavedSelection = null;
}

function ApplyStyles(aStyles)
{
  var className;
  var editor = EditorUtils.getCurrentEditor();
  switch (gDialog.cssPolicyMenulist.value) {
    case "id":
	    // if the element has no ID, ask for one...
	    if (!gCurrentElement.id) {
	      var result = {};
	      if (!PromptUtils.prompt(window,
	                              gDialog.csspropertiesBundle.getString("EnterAnId"),
	                              gDialog.csspropertiesBundle.getString("EnterUniqueId"),
	                              result))
	        return;
        editor.beginTransaction();
	      editor.setAttribute(gCurrentElement, "id", result.value);
	    }
      else
        editor.beginTransaction();
      break;

    case "class":
      if (!gDialog.classPicker.value) {
        PromptUtils.alertWithTitle(gDialog.csspropertiesBundle.getString("NoClasSelected"),
                                   gDialog.csspropertiesBundle.getString("PleaseSelectAClass"),
                                   window);
        return;
      }

      editor.beginTransaction();
      // make sure the element carries the user-selected class
      if (!gCurrentElement.classList.contains(gDialog.classPicker.value))
        gCurrentElement.classList.add(gDialog.classPicker.value); // XXX
      className = gDialog.classPicker.value;
      break;

    default:
      editor.beginTransaction();
      break;
  }

  SaveSelection();
  for (var i = 0; i < aStyles.length; i++) {
    var s = aStyles[i];
    var property = s.property;
    var value = s.value;

    switch (gDialog.cssPolicyMenulist.value) {

      case "id":
          ApplyStyleChangesToStylesheets(editor, gCurrentElement, property, value,
                                         "#", "#", gCurrentElement.id);
        break;

      case "inline":
        try {
          var txn = new diStyleAttrChangeTxn(gCurrentElement, property, value, "");
          EditorUtils.getCurrentEditor().transactionManager.doTransaction(txn);  
        }
        catch(e) {}
        break;

      case "class":
          ApplyStyleChangesToStylesheets(editor, gCurrentElement, property, value,
                                         ".", "\\.", className);
        break;
      default:
        break;
    }
  }
  editor.endTransaction();
  RestoreSelection();
}

function FindLastEditableStyleSheet()
{
  var doc = EditorUtils.getCurrentDocument();
  var headElt = doc.querySelector("head");
  var child = headElt.lastElementChild;
  var found = false;
  while (!found && child) {
    var name = child.nodeName.toLowerCase();
    if (name == "style" ||
        (name == "link" &&
         child.getAttribute("rel").toLowerCase() == "stylesheet" &&
         !child.hasAttribute("title"))) {
      if (name == "link") {
	      var uri = Components.classes["@mozilla.org/network/io-service;1"]
	                              .getService(Components.interfaces.nsIIOService)
	                              .newURI(child.sheet.href, null, null);
	      if (uri.scheme == "file")
	        found = true;
	      else
	        child = child.previousElementSibling;
      }
      else
        found = true;
    }
    else
      child = child.previousElementSibling;
  }
  if (found)
    sheet = child.sheet;
  else { // no editable stylesheet in the document, create one
    var styleElt = doc.createElement("style");
    styleElt.setAttribute("type", "text/css");
    EditorUtils.getCurrentEditor().insertNode(styleElt, headElt, headElt.childNodes.length);
    sheet = styleElt.sheet;
  }
  return sheet;
}

function ToggleProperty(aElt)
{
  var checked   = aElt.hasAttribute("checked");
  var value = (aElt.hasAttribute("value") ? aElt.getAttribute("value") : aElt.value);
  if (!checked &&
      (aElt.nodeName.toLowerCase() == "checkbox" || aElt.getAttribute("type") == "checkbox"))
    value = "";
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
  var unitsArray;
  if (aUnitsString == " ")
    unitsArray = [""];
  else
    unitsArray = aUnitsString.split(" ");
  unitsArray.forEach(function(aArrayElt, aIndex, aArray) {
    var menuitem = document.createElement("menuitem");
    menuitem.setAttribute("label", v + aArrayElt);
    menuitem.setAttribute("value", v + aArrayElt);
    aElt.insertBefore(menuitem, menuseparator);
  });
}

function ApplyPropertyFromMenulist(aElt)
{
  var value;
  if (aElt.selectedItem)
    value = aElt.selectedItem.value;
  else
    value = aElt.value;

  var toApply = [
                  {
                    property: aElt.getAttribute("property"),
                    value: value
                  }
                ];
  if (aElt.hasAttribute("fouredges") && aElt.hasAttribute("fouredgescontrol")) {
    if (document.getElementById(aElt.getAttribute("fouredgescontrol")).checked) {
      var edgesArray = aElt.getAttribute("fouredges").split(",");
      for (var i = 0; i < edgesArray.length; i++)
        toApply.push({
                       property: edgesArray[i],
                       value: value
                     } );
    }
  }
  ApplyStyles(toApply);
}

function IncreaseLength(aElt, aUnitsString, aCallback)
{
  var value;
  var menulist = aElt.previousSibling;
  if (menulist.selectedItem)
    value = menulist.selectedItem.value;
  else
    value = menulist.value;
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
    menulist.value = v + (unit ? unit : "");
    onLengthMenulistCommand(menulist, aUnitsString, '', false, aCallback);
  }
}

function DecreaseLength(aElt, aUnitsString, aAllowNegative, aCallback)
{
  var value;
  var menulist = aElt.previousSibling;
  if (menulist.selectedItem)
    value = menulist.selectedItem.value;
  else
    value = menulist.value;
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
    menulist.value = v + (unit ? unit : "");
    onLengthMenulistCommand(menulist, aUnitsString, '', aAllowNegative, aCallback);
  }
}

function onLengthMenulistCommand(aElt, aUnitsString, aIdentsString, aAllowNegative, aCallback)
{
  var idents = aIdentsString.split(" ");
  var value;
  if (aElt.selectedItem)
    value = aElt.selectedItem.value;
  else
    value = aElt.value;
  aElt.value = value;
  var units = aUnitsString.replace( / /g, "|");
  var r = new RegExp( "([+-]?[0-9]*\\.[0-9]+|[+-]?[0-9]+)(" + units + ")*", "");
  var match = value.match( r );
  if (aElt.getAttribute("property")) {
	  if (!value ||
	      (match && !(!aAllowNegative && parseFloat(match[1]) < 0) &&
	       (match[2] || units[0] == "|")) ||
	      idents.indexOf(value) != -1) {
	    var toApply = [ {
		                    property: aElt.getAttribute("property"),
		                    value: value
	                    } ];
	    if (aElt.hasAttribute("fouredges") && aElt.hasAttribute("fouredgescontrol")) {
	      if (document.getElementById(aElt.getAttribute("fouredgescontrol")).checked) {
		      var edgesArray = aElt.getAttribute("fouredges").split(",");
		      for (var i = 0; i < edgesArray.length; i++)
			      toApply.push({
			                     property: edgesArray[i],
			                     value: value
			                   } );
	      }
	    }
	    if (aElt.hasAttribute("checkimageratio") &&
	        gCurrentElement.nodeName.toLowerCase() == "img" &&
	        gDialog.preserveImageRatioCheckbox.checked) {
	      var id = aElt.id;
	      var otherId = (id == "widthMenulist") ? "heightMenulist" : "widthMenulist";
	      var otherValue = null;
	      if (value == "auto" ||
	          (value && value.indexOf("%") != -1))
	        otherValue = value;
	      else if (match) {
	        var ratio = (id == "widthMenulist") ? gCurrentElement.naturalHeight / gCurrentElement.naturalWidth :
	                                              gCurrentElement.naturalWidth / gCurrentElement.naturalHeight;
	        otherValue = (parseFloat(match[1]) * ratio) + match[2]; 
	      }
	
	      if (value)
	        toApply.push({
	                       property: gDialog[otherId].getAttribute("property"),
	                       value: otherValue
	                     } );
	    }
	    ApplyStyles(toApply);
	  }
  }
  if (aCallback)
    aCallback(aElt);
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

function ApplyStyleChangesToStylesheets(editor, aElement, property, value,
                                        aDelimitor, aRegExpDelimitor, aIdent)
{
  // first, clean the style attribute for the style to apply
  var txn = new diStyleAttrChangeTxn(aElement, property, "", "");
  EditorUtils.getCurrentEditor().transactionManager.doTransaction(txn);

  var ruleset = CssInspector.getCSSStyleRules(aElement, true);
  var inspectedRule = CssInspector.findRuleForProperty(ruleset, property);
  if (inspectedRule && inspectedRule.rule) {
    // ok, that property is already applied through a CSS rule

    // is that rule dependent on the ID selector for that ID?
    // if yes, let's try to tweak it
    var priority = inspectedRule.rule.style.getPropertyPriority(property);
    var selector = inspectedRule.rule.selectorText;
    var r = new RegExp( aRegExpDelimitor + aIdent + "$|" + aRegExpDelimitor + aIdent + "[\.:,\\[]", "g");
    if (selector.match(r)) {
      // yes! can we edit the corresponding stylesheet or not?
      var sheet = inspectedRule.rule.parentStyleSheet;
      var topSheet = sheet;
      while (topSheet.parentStyleSheet)
        topSheet = topSheet.parentStyleSheet;
      if (topSheet.ownerNode &&
          (!sheet.href || sheet.href.substr(0, 4) != "http")) {
        // yes we can edit it...
        if (sheet.href) { // external stylesheet
          var txn = new diChangeFileStylesheetTxn(sheet.href, inspectedRule.rule,
                                                  property, value, priority);
          EditorUtils.getCurrentEditor().transactionManager.doTransaction(txn);  
        }
        else { // it's an embedded stylesheet
          if (value) {
            inspectedRule.rule.style.setProperty(property, value, priority);
          }
          else
            inspectedRule.rule.style.removeProperty(property);
          if (!inspectedRule.rule.style.length)
            sheet.deleteRule(inspectedRule.rule);
          CssUtils.reserializeEmbeddedStylesheet(sheet, editor);
        }
        return;
      }
    }
    // we need to check if the rule
    // has a specificity no greater than an ID's one

    // we need to find the last locally editable stylesheet
    // attached to the document
    var sheet = FindLastEditableStyleSheet();
    var spec = inspectedRule.specificity;
    if (!spec.a &&
        ((spec.b == 1 && spec.c == 0 && spec.d == 0) ||
         !spec.b)) { 
      var existingRule = CssInspector.findLastRuleInRulesetForSelector(
                           ruleset, aDelimitor + aIdent);
      if (existingRule &&
          (!existingRule.parentStyleSheet.href || existingRule.parentStyleSheet.href.substr(0, 4) != "http")) {
        sheet = existingRule.parentStyleSheet;
        existingRule.style.setProperty(property, value, priority);
      }
      else { 
        // cool, we can just create a new rule with an ID selector
        // but don't forget to set the priority...
        sheet.insertRule(aDelimitor + aIdent + "{" +
                           property + ": " + value + " " +
                           (priority ? "!important" : "") + "}",
                         sheet.cssRules.length);
      }
      if (sheet.ownerNode.href)
        CssInspector.serializeFileStyleSheet(sheet, sheet.href);
      else
        CssUtils.reserializeEmbeddedStylesheet(sheet, editor);
      return;
    }
    // at this point, we have a greater specificity; hum, then what's
    // the priority of the declaration?
    if (!priority) {
      var existingRule = CssInspector.findLastRuleInRulesetForSelector(
                           ruleset, aDelimitor + aIdent);
      if (existingRule &&
          (!existingRule.parentStyleSheet.href || existingRule.parentStyleSheet.href.substr(0, 4) != "http")) {
        sheet = existingRule.parentStyleSheet;
        existingRule.style.setProperty(property, value, "important");
      }
      else {
        // no priority, so cool we can create a !important declaration
        // for the ID
        sheet.insertRule(aDelimitor + aIdent + "{" +
                           property + ": " + value + " !important }",
                         sheet.cssRules.length);
      }
      if (sheet.ownerNode.href)
        CssInspector.serializeFileStyleSheet(sheet, sheet.href);
      else
        CssUtils.reserializeEmbeddedStylesheet(sheet, editor);
      return;
    }
    // argl, it's already a !important declaration :-( our only
    // choice is a !important style attribute... We can't just clean the
    // style on inspectedRule because some other rules could also apply
    // is that one goes away.
    var txn = new diStyleAttrChangeTxn(aElement, property, value, "important");
    EditorUtils.getCurrentEditor().transactionManager.doTransaction(txn);
  }
  else {
    // oh, the property is not applied yet, let's just create a rule
    // with the ID selector for that property
    var sheet;
    var existingRule = CssInspector.findLastRuleInRulesetForSelector(
                         ruleset, aDelimitor + aIdent);
    if (existingRule &&
          (!existingRule.parentStyleSheet.href || existingRule.parentStyleSheet.href.substr(0, 4) != "http")) {
      sheet = existingRule.parentStyleSheet;
      existingRule.style.setProperty(property, value, "");
    }
    else {
      sheet = FindLastEditableStyleSheet();
      sheet.insertRule(aDelimitor + aIdent + "{" +
                         property + ": " + value + " " + "}",
                       sheet.cssRules.length);
    }
    if (sheet.ownerNode.href)
      CssInspector.serializeFileStyleSheet(sheet, sheet.href);
    else
      CssUtils.reserializeEmbeddedStylesheet(sheet, editor);
  }
}

function SetColor(aElt)
{
  var color = aElt.color;
  var toApply = [
	                {
	                  property: aElt.getAttribute("property"),
	                  value: color
	                }
                ];
  if (aElt.hasAttribute("fouredges") && aElt.hasAttribute("fouredgescontrol")) {
    if (document.getElementById(aElt.getAttribute("fouredgescontrol")).checked) {
      var edgesArray = aElt.getAttribute("fouredges").split(",");
      for (var i = 0; i < edgesArray.length; i++)
        toApply.push({
                       property: edgesArray[i],
                       value: color
                     } );
    }
  }
  ApplyStyles(toApply);
}

function CloseAllSection(aAlsoCloseOriginalTarget)
{
  var h = document.popupNode;
  while (h && !h.classList.contains("csspropertiesHeader"))
    h = h.parentNode;
  if (!h) return; // sanity check...

  var headers = document.querySelectorAll(".csspropertiesHeader");
  for (var i = 0; i < headers.length; i++) {
    var header = headers[i];
    if ((aAlsoCloseOriginalTarget || header != h) &&
        header.hasAttribute("open"))
      ToggleSection(header);
  }
}

#include general.js.inc
#include colors.js.inc
#include geometry.js.inc
#include position.js.inc
#include borders.js.inc
#include shadows.js.inc
#include lists.js.inc
#include transforms.js.inc
#include transitions.js.inc
#include flexbox.js.inc
#include columns.js.inc
#include misc.js.inc

