
Components.utils.import("resource://app/modules/unicodeHelper.jsm");

function Startup()
{
  GetUIElements();

  var blocks = UnicodeUtils.blocks;
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    var listitem = document.createElement("listitem");
    listitem.setAttribute("blockstart", b.start);
    var cell1 = document.createElement("listcell");
    cell1.setAttribute("label", b.start);
    var cell2 = document.createElement("listcell");
    cell2.setAttribute("label", b.name);
    listitem.appendChild(cell1);
    listitem.appendChild(cell2);
    gDialog.blocksListbox.appendChild(listitem);
  }

  for (var i = 0; i < 10; i++) {
    var row = document.createElement("row");
    row.setAttribute("align", "center");
    var label = document.createElement("label");
    label.className = "gridHeader";
    label.setAttribute("value", " ");
    row.appendChild(label);
    for (var j = 0; j < 16; j++) {
      var toolbarbutton = document.createElement("label");
      toolbarbutton.setAttribute("onclick", "ActivateChar(this)");
      toolbarbutton.setAttribute("value", " ");
      toolbarbutton.className = "gridCell";
      row.appendChild(toolbarbutton);
    }
    gDialog.charGridRows.appendChild(row);
  }

  UpdateChars(0x10470);
  document.addEventListener("DOMAttrModified", OnMutationEventOnScrollbar, false);
}

function ToHex4(n)
{
  var str = n.toString(16);
  while (str.length < 4)
    str = "0" + str;
  return str;
}

function UpdateChars(aStart)
{
  var p = new DOMParser();
  var labels = document.querySelectorAll("#charGridRows > row:not(:first-child) > .gridHeader");
  var buttons = document.querySelectorAll("#charGridRows > row:not(:first-child) > .gridCell");
  for (var i = 0; i < labels.length; i++) {
    labels[i].setAttribute("value", ToHex4(aStart));
    for (var j = 0; j < 16; j++) {
      buttons[i*16+j].setAttribute("char", aStart);
      var t =  p.parseFromString("<a>&#x" + ToHex4(aStart++) + ";</a>", "text/xml");
      if (t.documentElement.nodeName != "parsererror")
        buttons[i*16+j].setAttribute("value", t.documentElement.textContent);
      else
        buttons[i*16+j].setAttribute("value", "\u00a0");
    }
  }
}

function BlockSelected()
{
  var item = gDialog.blocksListbox.selectedItem;
  if (!item)
    return;

  var start = item.getAttribute("blockstart");
  UpdateChars(Number("0x" + start));
  gDialog.namesScrollbar.setAttribute("curpos", Number("0x" + start));
}

function OnMutationEventOnScrollbar(aEvent)
{
  var target = aEvent.target;
  

  var attrChange = aEvent.attrChange;
  var attrName = aEvent.attrName;
  var newValue = aEvent.newValue;

  // early way out in case of a scrollbar change
  if (attrName != "curpos" || target != gDialog.namesScrollbar)
    return;

  var curpos = parseInt(newValue);
  curpos = Math.floor(curpos / 16) * 16;
  UpdateChars(curpos);
}

function ActivateChar(aElt)
{
  var char = aElt.getAttribute("value");
  gDialog.charPreview.setAttribute("value", char);
  var code = parseInt(aElt.getAttribute("char"));
  var name = UnicodeUtils.getCharName(code);
  gDialog.charName.setAttribute("value", name);
  gDialog.charCode.setAttribute("value", ToHex4(code));

  var gridCells = document.querySelectorAll(".gridCell");
  for (var i = 0; i < gridCells.length; i++)
    gridCells[i].className = "gridCell";
  aElt.className = "gridCell selected";
}