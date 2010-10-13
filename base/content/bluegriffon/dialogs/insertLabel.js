Components.utils.import("resource://gre/modules/editorHelper.jsm");

var gNode = null;
var gEditor = null;

function Startup()
{
  gNode = window.arguments[0];
  gEditor = EditorUtils.getCurrentEditor();
  GetUIElements();

  var doc = EditorUtils.getCurrentDocument();
  var elts = doc.querySelectorAll("button[id], input[id]:not([type='hidden']), keygen[id], meter[id], output[id], progress[id], select[id], textarea[id]");
  var ids = [];
  for (var i = 0; i < elts.length; i++)
    ids.push(elts[i].id);
  ids.sort;
  for (var i = 0; i < ids.length; i++)
    gDialog.forMenulist.appendItem(ids[i], ids[i]);

  if (gNode) {
    InitDialog();
  }
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
      case "menulist":
        child.value = gNode.hasAttribute(attr) ?
                          gNode.getAttribute(attr) :
                          "";
        break;
      default: break; // should never happen
    }
  }
}

function onAccept()
{
  gEditor.beginTransaction();

  if (!gNode) {
    var doc = EditorUtils.getCurrentDocument();
    gNode = doc.createElement("label");
    //gNode.appendChild(doc.createElement("br"));
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
        default: break; // should never happen
      }
    }
  }

  gEditor.endTransaction();
  gEditor.selection.collapse(gNode, 0);
}
