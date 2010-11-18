Components.utils.import("resource://app/modules/editorHelper.jsm");
Components.utils.import("resource://app/modules/cssHelper.jsm");
Components.utils.import("resource://app/modules/cssInspector.jsm");
Components.utils.import("resource://app/modules/prompterHelper.jsm");

var gMain = null;
var gCurrentElement = null;
#ifdef XP_MACOSX
var gIsPanelActive = false;
#else
#ifdef XP_UNIX
var gIsPanelActive = true;
#else
var gIsPanelActive = false;
#endif
#endif
var gPrefs = null;
var gPath = null;

function Startup()
{
  GetUIElements();

  gPrefs = GetPrefs();

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
  gMain.NotifierUtils.addNotifierCallback("tabSelected",
                                          Inspect,
                                          window);
  gMain.NotifierUtils.addNotifierCallback("redrawPanel",
                                          RedrawAll,
                                          window);
  gMain.NotifierUtils.addNotifierCallback("panelClosed",
                                          PanelClosed,
                                          window);
  Inspect();
  if (gMain && gMain.EditorUtils && gIsPanelActive &&
      gMain.EditorUtils.getCurrentEditor()) {
    var c = gMain.EditorUtils.getSelectionContainer();
    if (c)
      SelectionChanged(null, c.node, c.oneElementSelected);
  }

  gDialog.elementsTree.addEventListener("keypress", onKeypressInElementsTree, true);
  gDialog.attributesTree.addEventListener("DOMAttrModified", onAttributesTreeModified, true);
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
    gMain.NotifierUtils.removeNotifierCallback("tabSelected",
                                               Inspect);
    gMain.NotifierUtils.removeNotifierCallback("redrawPanel",
                                                RedrawAll,
                                                window);
    gMain.NotifierUtils.removeNotifierCallback("panelClosed",
                                                PanelClosed,
                                                window);
	  gDialog.elementsTree.removeEventListener("keypress", onKeypressInElementsTree, true);
	  gDialog.attributesTree.removeEventListener("DOMAttrModified", onAttributesTreeModified, true);
  }
}

function Inspect()
{
  if (gMain && gMain.EditorUtils)
  {
    var editor = gMain.EditorUtils.getCurrentEditor();
    gDialog.mainBox.style.visibility = editor ? "" : "hidden";
    if (editor) {
      var node = EditorUtils.getSelectionContainer().node;
      if (node) {
        gCurrentElement = null;
        SelectionChanged(null, node, true);
      }
    }
    else {
		  var treechildren = gDialog.elementsTree.querySelector("treechildren");
		  if (treechildren)
		    gDialog.elementsTree.removeChild(treechildren);
    }
  }
}

function RedrawAll(aNotification, aPanelId)
{
  if (aPanelId == "panel-domexplorer") {
    gIsPanelActive = true;
    if (gCurrentElement) {
      // force query of all properties on the current element
      var elt = gCurrentElement;
      gCurrentElement = null;
      SelectionChanged(null, elt, true);
    }
  }
}

function PanelClosed(aNotification, aPanelId)
{
  if (aPanelId == "panel-domexplorer")
    gIsPanelActive = false;
}

function SelectionChanged(aArgs, aElt, aOneElementSelected)
{
  if (!gIsPanelActive) {
    gCurrentElement = aElt;
    return;
  }

  var path = "";
  var node = aElt;
  if (gPath)
	  while (node && node.nodeType == Node.ELEMENT_NODE) {
	    path += node.nodeName.toLowerCase() + ":";
	    var child = node;
	    var i = 0;
	    while (child.previousElementSibling) {
	      i++;
	      child = child.previousElementSibling;
	    }
	    path += i;
	    for (var i = 0; i < node.attributes.length; i++) {
	      path += "[" + node.attributes[i].nodeName + "=" +
	                    node.attributes[i].nodeValue + "]";
	    }
	
	    if (gPath.substr(0, path.length) != path)
	      break;
	
	    node = node.parentNode;
	  }
  
  if (gCurrentElement == aElt && gPath == path)
    return;

  gPath = path;
  gCurrentElement = aElt;

  var node = gCurrentElement;
  var elements = [];
  while (node && node.nodeType == Node.ELEMENT_NODE) {
    elements.push(node);
    node = node.parentNode;
  }

  var treechildren = gDialog.elementsTree.querySelector("treechildren");
  if (treechildren)
    gDialog.elementsTree.removeChild(treechildren);

  treechildren = document.createElement("treechildren");
  gDialog.elementsTree.appendChild(treechildren);

  var treeitem = document.createElement("treeitem");
  var treerow  = document.createElement("treerow");
  var treecell = document.createElement("treecell");
  treecell.setAttribute("label", elements[elements.length - 1].nodeName.toLowerCase());
	treeitem.setUserData("node", elements[elements.length - 1], null);
	treerow.appendChild(treecell);
  treeitem.appendChild(treerow);
  treechildren.appendChild(treeitem);

  var tmp = null;
  var selected = null;

  for (var i = elements.length - 1 ; i >= 0; i--) {
    var elt = elements[i];

    if (elt.firstElementChild) {
      treeitem.setAttribute("container", "true");
      treeitem.setAttribute("open", "true");
      var child = elt.firstElementChild;
      var parent = document.createElement("treechildren");
      treeitem.appendChild(parent);
      while (child) {
		    treeitem = document.createElement("treeitem");
        treeitem.setUserData("node", child, null);
		    treerow  = document.createElement("treerow");
		    treecell = document.createElement("treecell");
		    treecell.setAttribute("label", child.nodeName.toLowerCase());
		    treerow.appendChild(treecell);
		    treeitem.appendChild(treerow);
		    parent.appendChild(treeitem);

        if (i > 0 && child == elements[i-1]) {
          tmp = treeitem;
	      if (child == gCurrentElement)
	        selected = treeitem;
        }
        child = child.nextElementSibling;
      }
      treeitem = tmp;
    }
  }
  if (selected)
    gDialog.elementsTree.view.selection.select(gDialog.elementsTree.contentView.getIndexOfItem(selected));

  UpdateAttributes();
  //UpdateStyles();
}

function onKeypressInElementsTree(aEvent) {
  switch(aEvent.keyCode) {
    case KeyEvent.DOM_VK_DOWN:
    case KeyEvent.DOM_VK_RIGHT:
      SelectNextOrPreviousInTree(1)
      break;
    case KeyEvent.DOM_VK_LEFT:
    case KeyEvent.DOM_VK_UP:
      SelectNextOrPreviousInTree(-1)
      break;
    default:
      return;
  }

  aEvent.stopPropagation();
}

function SelectNextOrPreviousInTree(aIncrement)
{
  var tree = gDialog.elementsTree;
  var contentView = tree.contentView;
  var view = tree.view;
  var index = 0;
  if (view.selection.count) // No selection yet in the tree
  {
    index = view.selection.currentIndex;
  }
  index += aIncrement;
  if (index < 0)
    index = 0;
  if (index >= gDialog.elementsTree.view.rowCount)
    index = gDialog.elementsTree.view.rowCount - 1;
  var treeitem = contentView.getItemAtIndex(index);
  var node = treeitem.getUserData("node");
  try {
	  EditorUtils.getCurrentEditor().selectElement(node);
  }
  catch(e) {
    gDialog.elementsTree.view.selection.select(index);
    SelectionChanged(null, node, true);
  }
}

function UpdateAttributes()
{
  deleteAllChildren(gDialog.attributesTreechildren);
  var attributes = gCurrentElement.attributes;
  for (var i = 0; i < attributes.length; i++) {
    var attr = attributes[i];
    if (attr.nodeName.substr(0, 4) == "_moz")
      continue;
    var treeitem = document.createElement("treeitem");
    treeitem.setUserData("attribute", attr, null);
    var treerow  = document.createElement("treerow");
    treecellName = document.createElement("treecell");
    treecellValue = document.createElement("treecell");
    treecellName.setAttribute("label",  attr.nodeName);
    treecellValue.setAttribute("label", attr.nodeValue);
    treecellName.setAttribute("editable", "false");
    treerow.appendChild(treecellName);
    treerow.appendChild(treecellValue);
    treeitem.appendChild(treerow);
    gDialog.attributesTreechildren.appendChild(treeitem);
  }
}

var gEditing = -1;

function onAttributesTreeModified(aEvent)
{
  var target = aEvent.target;
  if (target != gDialog.attributesTree)
    return;

  var attrChange = aEvent.attrChange;
  var attrName = aEvent.attrName;
  var newValue = aEvent.newValue;

  if (attrName == "editing") {
    if (attrChange == 2) { // start editing
		  var tree = gDialog.attributesTree;
		  var contentView = tree.contentView;
		  var view = tree.view;
		  gEditing = view.selection.currentIndex;
    }
    else if (attrChange == 3 && gEditing >= 0) { // end editing
      EditorUtils.getCurrentEditor().setAttribute(gCurrentElement,
                               gDialog.attributesTree.view.getCellText(gEditing, gDialog.attributesTree.columns[0]),
                               gDialog.attributesTree.view.getCellText(gEditing, gDialog.attributesTree.columns[1]));
      gEditing = -1;
    }
  }
}

