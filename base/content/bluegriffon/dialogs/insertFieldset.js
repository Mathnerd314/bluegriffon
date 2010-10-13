Components.utils.import("resource://gre/modules/editorHelper.jsm");

var gNode = null;
var gEditor = null;
var gLegend = null;

function Startup()
{
  gNode = window.arguments[0];
  gEditor = EditorUtils.getCurrentEditor();
  GetUIElements();

  if (gNode) {
    InitDialog();
  }
}

function ToggleLegend(aElt)
{
  gDialog.legendContent.disabled = !aElt.checked;
}

function InitDialog()
{
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
        child.value = gNode.hasAttribute(attr) ?
                          gNode.getAttribute(attr) :
                          "";
        break;
      default: break; // should never happen
    }
  }

  var child = gNode.firstElementChild;
  if (child && child.nodeName.toLowerCase() == "legend") {
    gLegend = child;
    gDialog.insertLegendCheckbox.checked = true;
    gDialog.legendContent.value = gLegend.textContent;
    gDialog.legendContent.disabled = false;
  }
  else {
    gDialog.insertLegendCheckbox.checked = false;
    gDialog.legendContent.disabled = true;
  }
}

function onAccept()
{
  gEditor.beginTransaction();

  var doc = EditorUtils.getCurrentDocument();
  if (!gNode) {
    gNode = doc.createElement("fieldset");
    if (gDialog.insertLegendCheckbox.checked) {
      var legend =  doc.createElement("legend");
      legend.textContent = gDialog.legendContent.value;
      gNode.appendChild(legend);
    }
    gEditor.insertElementAtSelection(gNode, true);
  }
  else if (gLegend) {
    if (gDialog.insertLegendCheckbox.checked) {
      if (gLegend.textContent != gDialog.legendContent.value) {
        // update legend
	      var legend =  doc.createElement("legend");
	      legend.textContent = gDialog.legendContent.value;
        gEditor.insertNode(legend, gNode, 0);
        gEditor.deleteNode(gLegend);
        gLegend = legend;
      }
    }
    else {
      // remove legend
        gEditor.deleteNode(gLegend);
        gLegend = null;
    }
  }
  else if (gDialog.insertLegendCheckbox.checked) {
    var legend =  doc.createElement("legend");
    legend.textContent = gDialog.legendContent.value;
    gEditor.insertNode(legend, gNode, 0);
    gLegend = legend;
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
          if (child.value)
            gEditor.setAttribute(gNode, attr, child.value);
          else
            gEditor.removeAttribute(gNode, attr);
          break;
        default: break; // should never happen
      }
    }
  }

  gEditor.endTransaction();
}
