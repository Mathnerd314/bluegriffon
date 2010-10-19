Components.utils.import("resource://gre/modules/editorHelper.jsm");

var gDoc = null;
var gEditor = null;

function Startup()
{
  GetUIElements();
  gEditor = EditorUtils.getCurrentEditor();
  gDoc = gEditor.document;

  var headElt = gDoc.querySelector("head");
  var styleElts = headElt.querySelectorAll("style,link[rel='stylesheet'],link[rel='alternate stylesheet']");
  for (var i = 0; i < styleElts.length; i++) {
    var item = AddTreeItem(gDialog.contentsTree);
    var s = styleElts[i];
    var t1, t2, t3, t4;
    if (s.nodeName.toLowerCase() == "style") {
      t1 = "<style>";
      t2 = "";
      t3 = s.getAttribute("title");
      t4 = s.getAttribute("media");
    }
    else {
      t1 = s.getAttribute("href");
      t2 = ((s.getAttribute("rel").toLowerCase().trim() == "alternate stylesheet") ? "✔" : "");
      t3 = s.getAttribute("title");
      t4 = s.getAttribute("media");
    }
    var cell1 = document.createElement("treecell");
    cell1.setAttribute("label", t1);
    var cell2 = document.createElement("treecell");
    cell2.setAttribute("label", t2);
    var cell3 = document.createElement("treecell");
    cell3.setAttribute("label", t3);
    var cell4 = document.createElement("treecell");
    cell4.setAttribute("label", t4);
    item.firstChild.appendChild(cell1);
    item.firstChild.appendChild(cell2);
    item.firstChild.appendChild(cell3);
    item.firstChild.appendChild(cell4);
  }
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

function doss()
{
  var button = document.createElement("button");
  button.setAttribute("label", "bar");
  gDialog.stylesheetPanel.appendChild(button);
}

function AddStylesheet()
{
  window.openDialog("chrome://bluegriffon/content/dialogs/editStylesheet.xul",
                    "_blank",
		                "chrome,modal,titlebar,resizable=yes,dialog=yes",
		                null);
}
