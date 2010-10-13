Components.utils.import("resource://gre/modules/editorHelper.jsm");

var gNode = null;
var gEditor = null;

function Startup()
{
  gNode = window.arguments[0];
  gEditor = EditorUtils.getCurrentEditor();
  GetUIElements();

  if (gNode) {
    InitDialog();
    InitDialog2(gNode, gDialog.contentsTree);
  }
}

function onAccept()
{
  gEditor.beginTransaction();

  if (!gNode) {
    var doc = EditorUtils.getCurrentDocument();
    gNode = doc.createElement("select");
    gEditor.insertElementAtSelection(gNode, true);
  }

  ApplyAttributes();

  gEditor.endTransaction();
  gEditor.selection.collapse(gNode, 0);
}

function AddTreeItem(aElt)
{
  var treechildren = aElt.querySelector("treechildren")
  if (!treechildren) {
    treechildren = document.createElement("treechildren");
    aElt.appendChild(treechildren);
    if (aElt != gDialog.contentsTree) {
      aElt.setAttribute("container", "true");
      aElt.setAttribute("open", "true");
    }
  }
  var treeitem = document.createElement("treeitem");
  var treerow = document.createElement("treerow");
  treeitem.appendChild(treerow);
  treechildren.appendChild(treeitem);
  return treeitem;
}

function InitDialog2(node, refTree)
{
  var child = node.firstElementChild;
  while (child) {
    var item = null;
    switch (child.nodeName.toLowerCase()) {
      case "option":
        item = AddTreeItem(refTree);
        var cell1 = document.createElement("treecell");
        cell1.setAttribute("label", child.getAttribute("value"));
        var cell2 = document.createElement("treecell");
        cell2.setAttribute("label", child.hasAttribute("label") ? child.getAttribute("label") : child.textContent);
        var cell3 = document.createElement("treecell");
        cell3.setAttribute("label", child.hasAttribute("disabled") ? "✔" : "");
        var cell4 = document.createElement("treecell");
        cell4.setAttribute("label", child.hasAttribute("selected") ? "✔" : "");
        item.firstChild.appendChild(cell1);
        item.firstChild.appendChild(cell2);
        item.firstChild.appendChild(cell3);
        item.firstChild.appendChild(cell4);
        break;
      case "optgroup":
        item = AddTreeItem(refTree);
        var cell1 = document.createElement("treecell");
        cell1.setAttribute("label", child.getAttribute("value"));
        var cell2 = document.createElement("treecell");
        cell2.setAttribute("label", child.hasAttribute("label") ? child.getAttribute("label") : child.textContent);
        var cell3 = document.createElement("treecell");
        cell3.setAttribute("label", child.hasAttribute("disabled") ? "✔" : "");
        var cell4 = document.createElement("treecell");
        cell4.setAttribute("label", child.hasAttribute("selected") ? "✔" : "");
        item.firstChild.appendChild(cell1);
        item.firstChild.appendChild(cell2);
        item.firstChild.appendChild(cell3);
        item.firstChild.appendChild(cell4);
        InitDialog2(child, item)
        break;
      default: break;
    }

    child = child.nextElementSibling;
  }
}

function UpdateButtons()
{
  var tree = gDialog.contentsTree;
  var contentView = tree.contentView;
  var view = tree.view;
  if (!view || !view.selection || !view.selection.count) { // no selection...
    gDialog.MinusButton.disabled = true;
    gDialog.ConfigButton.disabled = true;
    gDialog.DownButton.disabled = true;
    gDialog.UpButton.disabled = true;
    return;
  }

  gDialog.MinusButton.disabled = false;
  gDialog.ConfigButton.disabled = false;
  var index = view.selection.currentIndex;
  gDialog.UpButton.disabled = !index;
  gDialog.DownButton.disabled = (index == view.rowCount - 1);
}

function AddOptgroup()
{
  gDialog.optGroupLabelTextbox.value = "";
  gDialog.optGroupDisabledCheckbox.checked = false;
  gDialog.optGroupPanel.openPopup(gDialog.PlusButton,
                                 "after_start", 0, 0,
                                 false, true);
}

function DeleteOpt()
{
  var tree = gDialog.contentsTree;
  var contentView = tree.contentView;
  var view = tree.view;
  var index = view.selection.currentIndex;
  var treeitem = contentView.getItemAtIndex(index);
  var treechildren = treeitem.parentNode;
  treechildren.removeChild(treeitem);
  if (treechildren.childNode.length == 0)
    treechildren.parentNode.removeChild(treechildren);
}

function doAddOptGroup()
{
	item = AddTreeItem(gDialog.contentsTree);
	var cell1 = document.createElement("treecell");
	cell1.setAttribute("label", "");
	var cell2 = document.createElement("treecell");
	cell2.setAttribute("label", gDialog.optGroupLabelTextbox.value);
	var cell3 = document.createElement("treecell");
	cell3.setAttribute("label", gDialog.optGroupDisabledCheckbox.checked ? "✔" : "");
	var cell4 = document.createElement("treecell");
	cell4.setAttribute("label", "");
	item.firstChild.appendChild(cell1);
	item.firstChild.appendChild(cell2);
	item.firstChild.appendChild(cell3);
	item.firstChild.appendChild(cell4);
  item.setAttribute("container", "true");
  gDialog.optGroupPanel.hidePopup();
  UpdateButtons();
}

function AddOption()
{
  gDialog.optionLabelTextbox.value = "";
  gDialog.optionValueTextbox.value = "";
  gDialog.optionSelectedCheckbox.checked = false;
  gDialog.optionDisabledCheckbox.checked = false;
  gDialog.optionPanel.openPopup(gDialog.PlusButton,
                                 "after_start", 0, 0,
                                 false, true);
}

function doAddOption()
{
  var tree = gDialog.contentsTree;
  var contentView = tree.contentView;
  var view = tree.view;
  var index = view.selection.currentIndex;
  var treeitem = contentView.getItemAtIndex(index);

  if (treeitem.hasAttribute("container")) {
	  item = AddTreeItem(treeitem);
	  var cell1 = document.createElement("treecell");
	  cell1.setAttribute("label", gDialog.optionLabelTextbox.value);
	  var cell2 = document.createElement("treecell");
	  cell2.setAttribute("label", gDialog.optionValueTextbox.value);
	  var cell3 = document.createElement("treecell");
	  cell3.setAttribute("label", gDialog.optionDisabledCheckbox.checked ? "✔" : "");
	  var cell4 = document.createElement("treecell");
	  cell4.setAttribute("label", gDialog.optionSelectedCheckbox.checked ? "✔" : "");
	  item.firstChild.appendChild(cell1);
	  item.firstChild.appendChild(cell2);
	  item.firstChild.appendChild(cell3);
	  item.firstChild.appendChild(cell4);
  }
  else {
    
  }
}

