RegisterIniter(FlexBoxSectionIniter);

function FlexBoxSectionIniter(aElt, aRuleset)
{
  var display = CssInspector.getCascadedValue(aRuleset, "display");
  gDialog.flexBoxEnabledCheckbox.checked = (display == "-moz-box");

  var ba = CssInspector.getCascadedValue(aRuleset, "-moz-box-align");
  CheckToggle(gDialog.startBoxAlignButton,    ba == "start");
  CheckToggle(gDialog.centerBoxAlignButton,   ba == "center");
  CheckToggle(gDialog.endBoxAlignButton,      ba == "end");
  CheckToggle(gDialog.baselineBoxAlignButton, ba == "baseline");
  CheckToggle(gDialog.stretchBoxAlignButton,  ba == "stretch");
}

function ToggleFlexBox()
{
  ApplyStyles( [
							   {
							     property: "display",
                   value: gDialog.flexBoxEnabledCheckbox.checked ? "-moz-box": ""
							   }
               ]);
}
