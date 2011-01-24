Components.utils.import("resource://app/modules/editorHelper.jsm");

function UpdateStructureBarContextMenu()
{
  var target = GetSelectedElementInTree();
  if (target) // sanity check
    EditorUtils.getCurrentEditor().selectElement(target);

  if (target && target.hasAttribute("lang"))
    gDialog.resetElementLanguageMenuitem.removeAttribute("disabled");
  else
    gDialog.resetElementLanguageMenuitem.setAttribute("disabled", "true");

  if (target && target == target.ownerDocument.body)
  {
    gDialog.deleteElementMenuitem.setAttribute("disabled", "true");
    gDialog.removeTagMenuitem.setAttribute("disabled", "true");
    gDialog.changeTagMenuitem.setAttribute("disabled", "true");
  }
  else
  {
    gDialog.deleteElementMenuitem.removeAttribute("disabled");
    gDialog.removeTagMenuitem.removeAttribute("disabled");
    gDialog.changeTagMenuitem.removeAttribute("disabled");
  }
}

function ResetLanguage(aEvent)
{
  var target = GetSelectedElementInTree();
  if (target)
  {
    var editor = EditorUtils.getCurrentEditor();
    editor.removeAttribute(target, "lang");
  }
}

function ShowLanguageDialog(aEvent)
{
  var target = GetSelectedElementInTree();
  if (target)
    window.openDialog("chrome://bluegriffon/content/dialogs/languages.xul","_blank",
                      "chrome,modal,titlebar,resizable", target);
}

function DeleteElement(aEvent)
{
  var target = GetSelectedElementInTree();
  if (target)
  {
    var editor = EditorUtils.getCurrentEditor();
    editor.deleteNode(target);
  }
}

function ExplodeElement(aEvent)
{
  var target = GetSelectedElementInTree();
  if (target)
  {
    var editor = EditorUtils.getCurrentEditor();
    var parent = target.parentNode;
    editor.beginTransaction();

    var child = target.lastChild;
    while (child) {
      var tmp = child.previousSibling;
      var clone = child.cloneNode(true)
      var txn = new diNodeInsertionTxn(clone, parent, target);
      editor.transactionManager.doTransaction(txn);

      child = tmp;
    }
    editor.deleteNode(target);

    editor.endTransaction();
  }
}

function ChangeTag(aEvent)
{
  var popupNode = document.popupNode;
  var textbox = document.createElement("textbox");
  textbox.setAttribute("value", popupNode.getAttribute("value"));
  textbox.setAttribute("width", popupNode.boxObject.width);
  textbox.className = "struct-textbox";

  var target = popupNode.getUserData("node");
  textbox.setUserData("node", target, null);
  popupNode.parentNode.replaceChild(textbox, popupNode);

  textbox.addEventListener("keypress", OnKeyPressWhileChangingTag, false);
  textbox.addEventListener("blur", ResetStructToolbar, true);

  textbox.select();
}

function ResetStructToolbar(event)
{
  var editor = EditorUtils.getCurrentEditor();
  var textbox = event.target;
  var element = textbox.getUserData("node");
  textbox.parentNode.removeChild(textbox);
  editor.selectElement(element);
}

function OnKeyPressWhileChangingTag(event)
{
  var editor = EditorUtils.getCurrentEditor();
  var textbox = event.target;

  var keyCode = event.keyCode;
  if (keyCode == 13) {
    var newTag = textbox.value;
    var element = textbox.getUserData("node");
    textbox.parentNode.removeChild(textbox);

    if (newTag.toLowerCase() == element.nodeName.toLowerCase())
    {
      // nothing to do
      window.content.focus();
      return;
    }

    var offset = 0;
    var childNodes = element.parentNode.childNodes;
    while (childNodes.item(offset) != element) {
      offset++;
    }

    editor.beginTransaction();

    try {
      var newElt = editor.document.createElement(newTag);
      if (newElt) {
        childNodes = element.childNodes;
        var childNodesLength = childNodes.length;
        var i;
        for (i = 0; i < childNodesLength; i++) {
          var clone = childNodes.item(i).cloneNode(true);
          newElt.appendChild(clone);
        }
        editor.insertNode(newElt, element.parentNode, offset+1);
        editor.deleteNode(element);
        editor.selectElement(newElt);

        window.content.focus();
      }
    }
    catch (e) {}

    editor.endTransaction();

  }
  else if (keyCode == 27) {
    // if the user hits Escape, we discard the changes
    window.content.focus();
  }
}
