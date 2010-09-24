RegisterIniter(TablesSectionIniter);

function TablesSectionIniter(aElt, aRuleset)
{
  var c = CssInspector.getCascadedValue(aRuleset, "cursor");
  CheckToggle(gDialog.autoTableLayoutButton, c == "auto");
  CheckToggle(gDialog.fixedTableLayoutButton, c == "fixed");
}
