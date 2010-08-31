RegisterIniter(GeneralSectionIniter);

function GeneralSectionIniter(aElt)
{
  deleteAllChildren(gDialog.fontFamilyListbox);

  var fontFamily = CssUtils.getComputedValue(aElt, "font-family");
  var fonts = fontFamily.split(",");
  fonts.forEach(function(aElt, aIndex, aArray) {
      gDialog.fontFamilyListbox.appendItem(aElt, aElt);
    });
  SetEnabledElement(gDialog.removeFontButton, gDialog.fontFamilyListbox.itemCount);

  var fw = CssUtils.getComputedValue(aElt, "font-weight");
  CheckToggle(gDialog.fontWeightBoldButton,    fw == "bold" || fw == "700");
  CheckToggle(gDialog.fontWeightLighterButton, fw == "lighter");
  CheckToggle(gDialog.fontWeightBolderButton,  fw == "bolder");

  var fs = CssUtils.getComputedValue(aElt, "font-style");
  CheckToggle(gDialog.fontStyleItalicButton,   fs == "italic");
  CheckToggle(gDialog.fontStyleObliqueButton,  fs == "oblique");

  var td = CssUtils.getComputedValue(aElt, "text-decoration");
  var tdArray = td.split(" ");
  CheckToggle(gDialog.textDecorationUnderlineButton,    tdArray.indexOf("underline") != -1);
  CheckToggle(gDialog.textDecorationOverlineButton,     tdArray.indexOf("overline") != -1);
  CheckToggle(gDialog.textDecorationLinethroughButton,  tdArray.indexOf("line-through") != -1);

  var tt = CssUtils.getComputedValue(aElt, "text-transform");
  CheckToggle(gDialog.textTransformLowercaseButton,   tt == "lowercase");
  CheckToggle(gDialog.textTransformUppercaseButton,   tt == "uppercase");
  CheckToggle(gDialog.textTransformLinethroughButton, tt == "line-through");
}
