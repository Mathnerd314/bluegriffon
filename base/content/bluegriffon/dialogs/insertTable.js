
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
  gDialog.cssToggler.init();
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

function CreateRowsAndCells(aTbody, aAttributes)
{
  // Create necessary rows and cells for the table
  for (var i = 0; i < gDialog.rowsInput.value; i++)
  {
    var newRow = gActiveEditor.document.createElement("tr");
    if (newRow)
    {
      aTbody.appendChild(newRow);
      for (var j = 0; j < gDialog.columnsInput.value; j++)
      {
        var newCell = gActiveEditor.document.createElement("td");
        if (aAttributes)
          for (var k = 0; k < aAttributes.length; k++)
          {
            var attr = aAttributes[k];
            newCell.setAttribute(attr.name, attr.value);
          }
        if (newCell)
        {
          newRow.appendChild(newCell);
        }
      }
    }
  }
}

function onAccept()
{
  var wrapping = gDialog.textWrapping.selectedItem.value;
  var align = gDialog.horizAlignment.value;
  var valign = gDialog.vertAlignment.value;
  var cellSpacing = gDialog.cellSpacing.value;
  var cellPadding = gDialog.cellPadding.value;

  var useCSS = CssUtils.getUseCSSPref();

  gActiveEditor.beginTransaction();

  var tableElement = gActiveEditor.document.createElement("table");
  var tableBody = gActiveEditor.document.createElement("tbody");
  
  if (tableBody)
  {
    
    tableElement.appendChild(tableBody);

    switch(useCSS)
    {
      case 0:
        tableElement.setAttribute("border", gDialog.borderInput.value);
        tableElement.setAttribute("width", Number(gDialog.widthInput.value) +
                                            (gDialog.widthPixelOrPercentMenulist.value == "pixels" ? "" : "%"));
        tableElement.setAttribute("cellpadding", gDialog.cellSpacing.value);
        tableElement.setAttribute("cellspacing", gDialog.cellPadding.value);
        {
          var attributes = [];
          if (gDialog.horizAlignment.value)
            attributes.push( { name: "align",
                               value: gDialog.horizAlignment.value });
          if (gDialog.vertAlignment.value)
            attributes.push( { name: "valign",
                               value: gDialog.vertAlignment.value });
          if (gDialog.textWrapping.value)
            attributes.push( { name: "nowrap",
                               value: "nowrap" });
        }
        CreateRowsAndCells(tableBody, attributes);
        break;

      case 1:
        {
          var styleAttr = "width: " + Number(gDialog.widthInput.value) +
                            (gDialog.widthPixelOrPercentMenulist.value == "pixels" ? "px" : "%") +
                            ";";
          styleAttr += "border-spacing: " + gDialog.cellPadding.value + "px;";
          styleAttr += "border: outset " + gDialog.borderInput.value + "px;";
          if (gDialog.horizAlignment.value)
            styleAttr += "text-align:" + gDialog.horizAlignment.value;
          tableElement.setAttribute("style", styleAttr);

          styleAttr = "";
          if (gDialog.vertAlignment.value)
            styleAttr += "vertical-align: " + gDialog.vertAlignment.value + ";";
          if (gDialog.textWrapping.value)
            styleAttr += "white-space: nowrap;";
          if (gDialog.cellPadding.value)
            styleAttr += "padding: " + gDialog.cellPadding.value + "px;";
          if (gDialog.borderInput.value != "0")
            styleAttr += "border: inset 1px;";
          if (styleAttr)
            CreateRowsAndCells(tableBody, [ { name: "style",
                                              value: styleAttr} ] ); 
          else
            CreateRowsAndCells(tableBody, null);
          
        }
        break;

      case 2:
        {
          CreateRowsAndCells(tableBody, null);
          // first, build the selector we're going to use
          var cssToggler = gDialog.cssToggler;
          var selectorText = (cssToggler.newID ?   '#' + cssToggler.newID : "") +
                             (cssToggler.newClass? '.' + cssToggler.newClass : "");
          var tableProperties = [
            { priority: false, property: "border",
              value: "outset " + gDialog.borderInput.value + "px" },
            { priority: false, property: "border-spacing",
              value: gDialog.cellPadding.value + "px" },
            { priority: false, property: "width",
              value: Number(gDialog.widthInput.value) +
                       (gDialog.widthPixelOrPercentMenulist.value == "pixels" ? "px" : "%") },
            { priority: false, property:  "text-align",
              value: gDialog.horizAlignment.value }
          ];
          CssUtils.addRuleForSelector(gActiveEditor.document,
                                      selectorText,
                                      tableProperties);
          if (cssToggler.newID)
            tableElement.setAttribute("id", cssToggler.newID);
          if (cssToggler.newClass)
            tableElement.setAttribute("class", cssToggler.newClass);

          var cellProperties = [];
          if (gDialog.vertAlignment.value)
            cellProperties.push( { priority: false,
                                  property: "vertical-align",
                                  value: gDialog.vertAlignment.value } );

          if (gDialog.textWrapping.value)
            cellProperties.push( { priority: false,
                                  property: "white-space",
                                  value: "nowrap" } );

          if (gDialog.cellPadding.value)
            cellProperties.push( { priority: false,
                                  property: "padding",
                                  value: gDialog.cellPadding.value + "px" } );

          if (gDialog.borderInput.value != "0")
            cellProperties.push( { priority: false,
                                  property: "border",
                                  value: "inset 1px" } );
          cellSelectorText = selectorText + " > * > tr > td," +
                             selectorText + " > * > tr > th";
          CssUtils.addRuleForSelector(gActiveEditor.document,
                                      cellSelectorText + "",
                                      cellProperties);
        }
        break;
    }

    // true means delete selection when inserting
    gActiveEditor.insertElementAtSelection(tableElement, true);


  }
  gActiveEditor.endTransaction();
}

function SelectSize(cell)
{
  if (document.documentElement.getButton("accept").hasAttribute("disabled"))
    return;

  var columns  = (gCellID % 10);
  var rows     = Math.ceil(gCellID / 10);

  gDialog.rowsInput.value    = rows;
  gDialog.columnsInput.value = columns;

  onAccept();
  window.close();
}

