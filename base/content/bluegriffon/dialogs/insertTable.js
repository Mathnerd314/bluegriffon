Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/cssInspector.jsm");

var gNode = null;
var gTable = null;
var gRows, gColumns, gRowsInHeader, gRowsInFooter;

function Startup()
{
  GetUIElements();
  gNode = window.arguments[0];

  InitTableData(gNode);
}

function onCssPolicyChange(aElt)
{
  var cssPolicy = aElt.value;
  gDialog.classPicker.style.visibility = (cssPolicy !="class") ? "hidden" : "visible";
  if (cssPolicy == "class")
    gDialog.classPicker.focus();
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

function onLengthMenulistCommand(aElt, aUnitsString, aAllowNegative, aCallback)
{
  var value;
  if (aElt.selectedItem)
    value = aElt.selectedItem.value;
  else
    value = aElt.value;
  aElt.value = value;
  var units = aUnitsString.replace( / /g, "|");
  var r = new RegExp( "([+-]?[0-9]*\\.[0-9]+|[+-]?[0-9]+)(" + units + ")*", "");
  var match = value.match( r );
  if (match) {
    var unit = match[2];
    var v    = parseFloat(match[1]);
    if (!aAllowNegative && v < 0) {
      v = 0;
      menulist.value = v + (unit ? unit : "");
    }
  }
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

function InitTableData(aNode)
{
  var node = aNode;
  while (node && node.nodeName.toLowerCase() != "table")
    node = node.parentNode;
  gTable = node;

  var ruleset = CssInspector.getCSSStyleRules(gTable, false);

  var w = CssInspector.getCascadedValue(ruleset, "width");
  if (!w && gTable.hasAttribute("width")) {
    w = gTable.getAttribute("width");
    if (w.indexOf("%") == -1)
      w += "px";
  }
  gDialog.widthMenulist.value = w;

  var h = CssInspector.getCascadedValue(ruleset, "height");
  if (!h && gTable.hasAttribute("height")) {
    h = gTable.getAttribute("height");
    if (h.indexOf("%") == -1)
      h += "px";
  }
  gDialog.heightMenulist.value = h;

  var rows = gTable.querySelectorAll("tbody > tr");
  gDialog.tableRowsTextbox.value = rows.length;
  gRows = rows.length;
  var columns = 0;
  for (var i = 0; i < rows.length; i++) {
    columns = Math.max(columns, rows[i].querySelectorAll("td,th").length);
  }
  gDialog.tableColumnsTextbox.value = columns;
  gColumns = columns;

  var headerRows = gTable.querySelectorAll("thead > tr");
  gRowsInHeader = headerRows ? headerRows.length : 0;
  gDialog.rowsInHeaderTextbox.value = gRowsInHeader;
  gDialog.onlyHeaderCellsInHeaderCheckbox.checked = gRowsInHeader && !gTable.querySelector("thead > tr > td");

  var footerRows = gTable.querySelectorAll("tfoot > tr");
  gRowsInFooter = footerRows ? footerRows.length : 0;
  gDialog.rowsInFooterTextbox.value = gRowsInFooter;
  gDialog.onlyHeaderCellsInFooterCheckbox.checked = gRowsInFooter && !gTable.querySelector("tfoot > tr > td");

  var border = gTable.getAttribute("border");
  border = border ? border : 0;
  gDialog.tableBorderTextbox.value = border;

  var cellSpacing = gTable.getAttribute("cellspacing");
  gDialog.tableCellSpacingTextbox.value = cellSpacing;
  gDialog.tableCellSpacingUnitMenulist.value =
    (cellSpacing && cellSpacing.indexOf("%") != -1) ? "%" : "";

  var cellPadding = gTable.getAttribute("cellpadding");
  gDialog.tableCellPaddingTextbox.value = cellPadding;
  gDialog.tableCellPaddingUnitMenulist.value =
    (cellPadding && cellPadding.indexOf("%") != -1) ? "%" : ""; 
}

function ValidateData()
{
  var tab = gDialog.tabbox.selectedTab.value;
  var editor = EditorUtils.getCurrentEditor();
  editor.beginTransaction();
  switch(tab) {
    case "table":
      editor.setAttribute(gTable, "border", gDialog.tableBorderTextbox.value);
      if (gDialog.tableCellPaddingTextbox.value)
        editor.setAttribute(gTable, "cellpadding", gDialog.tableCellPaddingTextbox.value + gDialog.tableCellPaddingUnitMenulist.value);
      else
        editor.removeAttribute(gTable, "cellpadding");
      if (gDialog.tableCellSpacingTextbox.value)
        editor.setAttribute(gTable, "cellspacing", gDialog.tableCellSpacingTextbox.value + gDialog.tableCellSpacingUnitMenulist.value);
      else
        editor.removeAttribute(gTable, "cellspacing");
      editor.removeAttribute(gTable, "width");
      editor.removeAttribute(gTable, "height");
      var txn = new diStyleAttrChangeTxn(gTable, "width", gDialog.widthMenulist.value, "");
      editor.transactionManager.doTransaction(txn);
      txn = new diStyleAttrChangeTxn(gTable, "height", gDialog.heightMenulist.value, "");
      editor.transactionManager.doTransaction(txn);
      var header = gTable.querySelector("thead");
      if (!gDialog.rowsInHeaderTextbox.value) {
        // delete the header if it exists...
        if (header)
          editor.deleteNode(header);
      }
      else {
        // add or remove rows as needed
        if (!header) {
          // ah, we need to create the header first...
          header = editor.document.createElement("thead");
          var where = gTable.querySelector("tfoot") || gTable.querySelector("tbody");
		      txn = new diInsertNodeBeforeTxn(header, gTable, where);
		      editor.transactionManager.doTransaction(txn);
        }
        UpdateListOfRows(header, gRowsInHeader, gDialog.rowsInHeaderTextbox.value,
                         gDialog.onlyHeaderCellsInHeaderCheckbox.checked ? "th" : "td");
      }
      var footer = gTable.querySelector("tfoot");
      if (!gDialog.rowsInFooterTextbox.value) {
        // delete the header if it exists...
        if (footer)
          editor.deleteNode(footer);
      }
      else {
        // add or remove rows as needed
        if (!footer) {
          // ah, we need to create the header first...
          footer = editor.document.createElement("tfoot");
          var where = gTable.querySelector("tbody");
          txn = new diInsertNodeBeforeTxn(footer, gTable, where);
          editor.transactionManager.doTransaction(txn);
        }
        UpdateListOfRows(footer, gRowsInFooter, gDialog.rowsInFooterTextbox.value,
                         gDialog.onlyHeaderCellsInFooterCheckbox.checked ? "th" : "td");
      }

      UpdateListOfRows(gTable.querySelector("tbody"), gRows, gDialog.tableRowsTextbox.value,
                       "td");
      break;
    default: break;
  }
  editor.endTransaction();
}

function onAccept()
{
  ValidateData();
  return true;
}

function OnlyDigits(aElt)
{
  aElt.value = aElt.value.replace( /[^\d]/g, "");
}

function Increase(aId)
{
  var value = gDialog[aId].value;
  gDialog[aId].value = parseInt(value) + 1;
}

function Decrease(aId)
{
  var value = gDialog[aId].value;
  value = Math.max( 0, parseInt(value) - 1);
  gDialog[aId].value = value;
}


function UpdateListOfRows(aElement, aOldRows, aNewRows, aCellTag)
{
  var editor = EditorUtils.getCurrentEditor();

  // add missing rows if any
  for (var i = aOldRows; i < aNewRows; i++) {
    var tr = editor.document.createElement("tr");
    for (var j = 0; j < gDialog.tableColumnsTextbox.value; j++) {
      var cell = editor.document.createElement(aCellTag);
      var br = editor.document.createElement("br");
      cell.appendChild(br);
      tr.appendChild(cell);
    }
    editor.insertNode(tr, aElement, aElement.childNodes.length);
  }

  // browse the existing rows
  var rows = aElement.querySelectorAll("tr");
  for (var i = 0; i < aOldRows; i++) {
    var row = rows[i];
    var cellCount = 0;
    var cell = row.firstElementChild;
    while (cell) {
      var tmp = cell.nextElementSibling;
      cellCount += (cell.hasAttribute("colspan") ? parseInt(cell.getAttribute("colspan")) : 1);
      if (cellCount > gDialog.tableColumnsTextbox.value)
        editor.deleteNode(cell);
      cell = tmp;
    }
    // now add potential missing cells
    for (var j = cellCount; j < gDialog.tableColumnsTextbox.value; j++) {
      var cell = editor.document.createElement(aCellTag);
      var br = editor.document.createElement("br");
      cell.appendChild(br);
      row.appendChild(cell);
    }
  }
  // and finally get rid of the supplementary rows if any
  for (var i = aOldRows - 1 ; i >= aNewRows; i--) {
    if (i < rows.length)
      editor.deleteNode(rows[i]);
  }
}

/********************** diInsertNodeBeforeTxn **********************/

function diInsertNodeBeforeTxn(aNode, aParent, aRef)
{
  this.mNode = aNode;
  this.mParent = aParent;
  this.mRef = aRef;
}

diInsertNodeBeforeTxn.prototype = {

  getNode:    function() { return this.mNode; },

  QueryInterface : function(aIID)
  {
    if (aIID.equals(Components.interfaces.nsITransaction) ||
        aIID.equals(Components.interfaces.diINodeInsertionTxn) ||
        aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
        aIID.equals(Components.interfaces.nsISupports))
      return this;
    throw Components.results.NS_NOINTERFACE;
  },

  doTransaction: function()
  {
    this.mParent.insertBefore(this.mNode, this.mRef);
  },

  undoTransaction: function()
  {
    this.mNode.parentNode.removeChild(this.mNode);
  },

  redoTransaction: function()
  {
    this.doTransaction();
  },

  isTransient: false,

  merge: function(aTransaction)
  {
    return false;
  }
};
