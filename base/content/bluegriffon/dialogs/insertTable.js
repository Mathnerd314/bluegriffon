
var gCellID = 12;
var gActiveEditor = null;
var gPrefs = null;

function Startup()
{
  gActiveEditor = EditorUtils.getCurrentTableEditor();
  if (!gActiveEditor)
  {
    dump("Failed to get active editor!\n");
    window.close();
    return;
  }

  GetUIElements();
  SetWidthTextBoxMax(null);
}

function SetWidthTextBoxMax(aElt)
{
  var defaultWidth_unit;
  if (aElt)
  {
    defaultWidth_unit = aElt.getAttribute("value");
  }
  else
  {
    gPrefs = GetPrefs();
    if (!gPrefs)
      return;
  
    defaultWidth_unit  = gPrefs.getCharPref("bluegriffon.defaults.table.width_unit");
  }

  if (defaultWidth_unit == "percentage")
    gDialog.widthInput.setAttribute("max", "100");
  else
    gDialog.widthInput.removeAttribute("max");
  var foo = gDialog.widthInput.value;
  gDialog.widthInput.value = foo;
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

function onAccept()
{
  var wrapping = gDialog.textWrapping.selectedItem.value;
  var align = gDialog.horizAlignment.value;
  var valign = gDialog.vertAlignment.value;
  var cellSpacing = gDialog.cellSpacing.value;
  var cellPadding = gDialog.cellPadding.value;

  var rows = 
  gActiveEditor.beginTransaction();

  var tableElement = gActiveEditor.createElementWithDefaults("table");
  var tableBody = gActiveEditor.createElementWithDefaults("tbody");
  if (tableBody)
  {
    tableElement.appendChild(tableBody);

    // Create necessary rows and cells for the table
    for (var i = 0; i < gDialog.rowsInput.value; i++)
    {
      var newRow = gActiveEditor.createElementWithDefaults("tr");
      if (newRow)
      {
        tableBody.appendChild(newRow);
        for (var j = 0; j < gDialog.columnsInput.value; j++)
        {
          var newCell = gActiveEditor.createElementWithDefaults("td");
          if (newCell)
          {
            newRow.appendChild(newCell);
          }
        }
      }
    }
    // true means delete selection when inserting
    gActiveEditor.insertElementAtSelection(tableElement, true);
    gActiveEditor.setAttribute(tableElement, "border", gDialog.borderInput.value);
    gActiveEditor.setAttribute(tableElement, "width", Number(gDialog.widthInput.value) +
                                        (gDialog.widthPixelOrPercentMenulist.value == "pixels" ? "" : "%"));

  }
  gActiveEditor.endTransaction();
}

function SelectSize(cell)
{
  var columns  = (gCellID % 10);
  var rows     = Math.ceil(gCellID / 10);

  gDialog.rowsInput.value    = rows;
  gDialog.columnsInput.value = columns;

  onAccept();
  window.close();
}

