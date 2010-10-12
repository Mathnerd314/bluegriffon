Components.utils.import("resource://gre/modules/editorHelper.jsm");

var gNode = null;
var gType = null;
var gEditor = null;

const kPARAMETERS = [
  ["name", "value", "disabled"],
  ["name", "value", "disabled", "autocomplete", "list", "maxlength", "pattern", "placeholder", "readonly", "required", "size"],
  ["name", "value", "disabled", "autocomplete", "list", "maxlength", "multiple", "pattern", "placeholder", "readonly", "required", "size"],
  ["name", "value", "disabled", "autocomplete", "maxlength", "pattern", "placeholder", "readonly", "required", "size"],
  ["name", "value", "disabled", "autocomplete", "list", "max", "min", "readonly", "required", "step"],
  ["name", "value", "disabled", "autocomplete", "list", "max", "min", "readonly", "required", "step"],
  ["name", "value", "disabled", "autocomplete", "list", "max", "min", "step"],
  ["name", "value", "disabled", "autocomplete", "list"],
  ["name", "value", "disabled", "checked", "required"],
  ["name", "value", "disabled", "accept", "multiple", "required"],
  ["name", "value", "disabled", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget"],
  ["name", "value", "disabled", "alt", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "height", "src", "width"],
  ["name", "value", "disabled"]
];

const kTYPES = {
  "hidden":         0,
  "text":           1,
  "search":         1,
  "url":            1,
  "tel":            1,
  "email":          2,
  "password":       3,
  "datetime":       4,
  "date":           4,
  "month":          4,
  "week":           4,
  "time":           4,
  "datetime-local": 5,
  "number":         5,
  "range":          6,
  "color":          7,
  "checkbox":       8,
  "radio":          8,
  "file":           9,
  "submit":         10,
  "image":          11,
  "reset":          12,
  "button":         12
};

function Startup()
{
  gNode = window.arguments[0];
  gType = window.arguments[1];
  gEditor = EditorUtils.getCurrentEditor();
  GetUIElements();

  gDialog.typeMenulist.value = gType;
  if (gNode) {
    InitDialog();
    gDialog.typeMenulist.disabled = true;
    document.documentElement.getButton("accept").disabled = false;
  }

  window.sizeToContent();
  AdaptDialog();
}

function ToggleMultibuttons(aElt)
{
  if (!aElt.checked)
    return;
  var buttons = aElt.parentNode.querySelectorAll(".multibutton");
  for (var i = 0; i < buttons.length; i++) {
    var b = buttons[i];
    if (b != aElt)
      b.removeAttribute("checked");
  }
}

function AdaptDialog()
{
  var type = gDialog.typeMenulist.value;
  var attrType = kTYPES[type];
  var visibleAttributes = kPARAMETERS[attrType];
  var rows = gDialog.mainGrid.querySelectorAll("row");
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var attr = row.getAttribute("attribute");
    row.collapsed = (visibleAttributes.indexOf(attr) == -1);
  }
  window.sizeToContent();
}

function InitDialog()
{
  if (!gNode)
    return;

  var rows = gDialog.mainGrid.querySelectorAll("row");
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var attr = row.getAttribute("attribute");
    var child = row.firstElementChild.nextElementSibling;
    switch (child.nodeName.toLowerCase()) {
      case "checkbox":
        child.checked = gNode.hasAttribute(attr);
        break;
      case "textbox":
      case "menulist":
        child.value = gNode.hasAttribute(attr) ?
                          gNode.getAttribute(attr) :
                          "";
        break;
      case "hbox":
	      {
	        var c = child.firstElementChild;
          var value = gNode.hasAttribute(attr) ?
                          gNode.getAttribute(attr) :
                          "";
          while (c) {
            if (c.getAttribute("value") == value)
              c.setAttribute("checked", "true");
            else
              c.removeAttribute("checked");
            c = c.nextElementSibling;
          }
	      }
        break;
      default: break; // should never happen
    }
  }
}

function onAccept()
{
  gEditor.beginTransaction();

  if (!gNode) {
    gNode = EditorUtils.getCurrentDocument().createElement("input");
    gNode.setAttribute("type", gDialog.typeMenulist.value);
    gEditor.insertElementAtSelection(gNode, true);
  }

  var rows = gDialog.mainGrid.querySelectorAll("row");
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var attr = row.getAttribute("attribute");
    if (!row.collapsed) {
      var child = row.firstElementChild.nextElementSibling;
	    switch (child.nodeName.toLowerCase()) {
	      case "checkbox":
	        if (child.checked)
            gEditor.setAttribute(gNode, attr, attr);
          else
            gEditor.removeAttribute(gNode, attr);
	        break;
	      case "textbox":
	      case "menulist":
          if (child.value)
            gEditor.setAttribute(gNode, attr, child.value);
          else
            gEditor.removeAttribute(gNode, attr);
	        break;
	      case "hbox":
	        {
	          var c = child.firstElementChild;
	          while (c) {
              if (c.hasAttribute("checked")) {
                gEditor.setAttribute(gNode, attr, child.getAttribute("value"));
                break;
              }
	            c = c.nextElementSibling;
	          }
            if (!c)
              gEditor.removeAttribute(gNode, attr);
	        }
	        break;
	      default: break; // should never happen
	    }
    }
  }

  gEditor.endTransaction();
}