RegisterIniter(MiscSectionIniter);

function MiscSectionIniter(aElt, aRuleset)
{
  var c = CssInspector.getCascadedValue(aRuleset, "cursor");
  gDialog.cursorMenulist.value = c;

  var ub = CssInspector.getCascadedValue(aRuleset, "unicode-bidi");
  CheckToggle(gDialog.normalUnicodeBidiButton,       ub == "normal");
  CheckToggle(gDialog.embedUnicodeBidiButton,        ub == "embed");
  CheckToggle(gDialog.bidiOverrideUnicodeBidiButton, ub == "bidi-override");

}
