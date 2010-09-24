RegisterIniter(MiscSectionIniter);

function MiscSectionIniter(aElt, aRuleset)
{
  var c = CssInspector.getCascadedValue(aRuleset, "cursor");
  gDialog.cursorMenulist.value = c;
}
