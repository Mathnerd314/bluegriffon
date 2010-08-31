RegisterIniter(ColumnsSectionIniter);

function ColumnsSectionIniter(aElt)
{
  var columnCount = CssUtils.getComputedValue(aElt, "-moz-column-count");
  if (columnCount == "auto")
    columnCount = "1";
  gDialog.columnCount.value = columnCount;
}

function SetColumnCount(aN)
{
  gDialog.columnCount.value = aN;
  ColumnCountChanged();
}

function ColumnCountChanged()
{
  var count = gDialog.columnCount.value;
  if (count == "1")
    count = "";

  ApplyStyles([
	              {
	                property: "-moz-column-count",
	                value: count
	              }
              ]);
}

