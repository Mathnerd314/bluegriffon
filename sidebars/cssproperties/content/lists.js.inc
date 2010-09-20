RegisterIniter(GeneralSectionIniter);

function GeneralSectionIniter(aElt, aRuleset)
{
  var lst = CssInspector.getCascadedValue(aRuleset, "list-style-type");
  gDialog.listStyleTypeMenulist.value = lst;
}
