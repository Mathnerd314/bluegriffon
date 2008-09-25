
var gCellID = 12;
var gDefaults = {};

var gPrefs = null;
function Startup()
{
  GetUIElements();

  gPrefs = GetPrefs();
  if (!gPrefs)
    return;

  gDefaults.halign      = gPrefs.gPrefs.getCharPref("bluegriffon.defaults.table.halign");
  gDefaults.valign      = gPrefs.gPrefs.getCharPref("bluegriffon.defaults.table.valign");
  gDefaults.border      = gPrefs.gPrefs.getCharPref("bluegriffon.defaults.table.border");
  gDefaults.rows        = gPrefs.gPrefs.getCharPref("bluegriffon.defaults.table.rows");
  gDefaults.cols        = gPrefs.gPrefs.getCharPref("bluegriffon.defaults.table.cols");
  gDefaults.width       = gPrefs.gPrefs.getCharPref("bluegriffon.defaults.table.width");
  gDefaults.width_unit  = gPrefs.gPrefs.getCharPref("bluegriffon.defaults.table.width_unit");
  gDefaults.text_wrap   = gPrefs.gPrefs.getCharPref("bluegriffon.defaults.table.text_wrap");
  gDefaults.width       = gPrefs.gPrefs.getCharPref("bluegriffon.defaults.table.width");
  gDefaults.width       = gPrefs.gPrefs.getCharPref("bluegriffon.defaults.table.width");
  gDefaults.width       = gPrefs.gPrefs.getCharPref("bluegriffon.defaults.table.width");
}

function SelectArea(cell)
{
  var cellID    = cell.id;
  var numCellID = Number(cellID.substr(1));

  // early way out if we can...
  if (gCellID == numCellID)
    return;

  gCellID = numCellID;

  var i, anyCell;
  for (i = 1; i < 60; i += 10)
  {
    anyCell = gDialog["c"+i];
    while (anyCell)
    {
      anyCell.removeAttribute("class");
      anyCell = anyCell.nextSibling;
    }
  }

  for (i = numCellID; i > 0; i -= 10)
  {
    anyCell = gDialog["c"+i];
    while (anyCell)
    {
      anyCell.setAttribute("class", "selected");
      anyCell = anyCell.previousSibling;
    }
  }
  ShowSize();
}

function ShowSize()
{
  var columns  = (gCellID % 10);
  var rows     = Math.ceil(gCellID / 10);
  gDialog.sizeLabel.value = rows + " x " + columns;
}

