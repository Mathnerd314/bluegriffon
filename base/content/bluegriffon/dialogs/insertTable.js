Components.utils.import("resource://gre/modules/editorHelper.jsm");
Components.utils.import("resource://gre/modules/cssInspector.jsm");

var gNode = null;
var gTable = null;

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

function onLengthMenulistCommand(aElt, aUnitsString, aIdentsString, aAllowNegative, aCallback)
{
  var idents = aIdentsString.split(" ");
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
  var columns = 0;
  for (var i = 0; i < rows.length; i++) {
    columns = Math.max(columns, rows[i].querySelectorAll("td,th").length);
  }
  gDialog.tableColumnsTextbox.value = columns;

  var headerRows = gTable.querySelector("thead > tr");
  gDialog.rowsInHeaderTextbox.value = headerRows ? headerRows.length : 0;

  var footerRows = gTable.querySelector("tfoot > tr");
  gDialog.rowsInFooterTextbox.value = footerRows ? footerRows.length : 0;
}





