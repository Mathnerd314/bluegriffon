Components.utils.import("resource://app/modules/cssHelper.jsm");
Components.utils.import("resource://app/modules/editorHelper.jsm");
Components.utils.import("resource://app/modules/urlHelper.jsm");

var gNode = null;

function Startup()
{
  gNode = window.arguments[0];

  GetUIElements();

  InitDialog();
}

function InitDialog()
{
}


function onAccept()
{
  var id = gDialog.anchorNameMenulist.value;
  var editor = EditorUtils.getCurrentEditor();
  if (gNode) {
    if (gOriginalAnchor) {
      if (gNode.id == gOriginalAnchor)
        gNode.id = id;
      else if (gNode.nodeName.toLowerCase() == "a" && gNode.getAttribute("name") == gOriginalAnchor)
        gNode.setAttribute("name", id);
    }
    else
      gNode.id = id;
  }
  else {
    var isCollapsed = editor.selection.isCollapsed;
    if (isCollapsed) {
      editor.beginTransaction();
      var anchor = editor.document.createElement("a")
      anchor.setAttribute("name", id);
      try {
        editor.insertElementAtSelection(anchor, false);
        editor.endTransaction();
        if (gIsHTML5) {
          editor.setAttribute(anchor, "id", id);
          //editor.removeAttribute(anchor, "name");
          //editor.setCaretAfterElement(anchor);
        }
      }
      catch (e) {}
    }
    else
      editor.setInlineProperty("a", gIsHTML5 ? "id" : "name", id)
  }
}

function ToggleMultiButton(aElt)
{
  if (aElt.getAttribute("checked")) {
    var value = aElt.getAttribute("value");
    switch (value) {
      case "inside":
        gDialog.outsideListStylePositionButton.removeAttribute("checked");
        break;
      case "outside":
        gDialog.insideListStylePositionButton.removeAttribute("checked");
        break;
       default: break; //never happens
    }
  }
}