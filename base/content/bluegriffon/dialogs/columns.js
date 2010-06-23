Components.utils.import("resource://gre/modules/colourPickerHelper.jsm");
Components.utils.import("resource://gre/modules/cssHelper.jsm");

var gNode = null;
function Startup()
{
  
  GetUIElements();
  gNode = window.arguments[0];
  gDialog.gapLengthbox.extraValues = [
       {value :"normal", label: gDialog.bundleString.getString("NormalGapWidth")}
      ];
  gDialog.ruleLengthbox.extraValues = [
       {value :"thin", label: gDialog.bundleString.getString("ThinRule")},
       {value :"medium", label: gDialog.bundleString.getString("MediumRule")},
       {value :"thin", label: gDialog.bundleString.getString("ThickRule")}
      ];

  var cs = CssUtils.getComputedStyle(gNode, "");
  var mozColumnCount = cs.getPropertyValue("-moz-column-count");
  gDialog.enableColumnsCheckbox.checked = (mozColumnCount != "auto");
  ToggleColumns(gDialog.enableColumnsCheckbox);
  if (gDialog.enableColumnsCheckbox.checked) {
    var mozColumnWidth = cs.getPropertyValue("-moz-column-width");
    var mozColumnGap   = cs.getPropertyValue("-moz-column-gap");
    var mozColumnRuleWidth = cs.getPropertyValue("-moz-column-rule-width");
    var mozColumnRuleStyle = cs.getPropertyValue("-moz-column-rule-style");
    var mozColumnRuleColor = cs.getPropertyValue("-moz-column-rule-color");

    gDialog.columnCount.value = mozColumnCount;
    gDialog.columnWidthLengthbox.value = mozColumnWidth;
    gDialog.gapLengthbox.value =  mozColumnGap;
    gDialog.ruleLengthbox.value = mozColumnRuleWidth;
    gDialog.columnRuleStyleMenulist.value = mozColumnRuleStyle;
    gDialog.columnRuleColorpicker.color = mozColumnRuleColor;
  }
}


function SetColumnCount(aV)
{
  gDialog.columnCount.value = aV;
}

function ToggleColumns(aElt)
{
  var checked = aElt.checked;
  SetEnabledElement(gDialog.columnCount, checked);
  SetEnabledElement(gDialog.oneColumnButton, checked);
  SetEnabledElement(gDialog.twoColumnsButton, checked);
  SetEnabledElement(gDialog.threeColumnsButton, checked);

  SetEnabledElementAndControl(gDialog.columnWidthLengthboxLabel, checked);
  SetEnabledElementAndControl(gDialog.gapLengthboxLabel, checked);
  SetEnabledElementAndControl(gDialog.ruleLengthboxLabel, checked);

  SetEnabledElementAndControl(gDialog.ruleLengthboxLabel, checked);
  SetEnabledElementAndControl(gDialog.columnRuleStyleLabel, checked);
  SetEnabledElementAndControl(gDialog.columnRuleColorpickerLabel, checked);
}


function onAccept()
{
  var mozColumnEnabled = gDialog.enableColumnsCheckbox.checked;
  var mozColumnCount = gDialog.columnCount.value;
  var mozColumnWidth = gDialog.columnWidthLengthbox.value;
  var mozColumnGap =  gDialog.gapLengthbox.value;
  var mozColumnRuleWidth = gDialog.ruleLengthbox.value;
  var mozColumnRuleStyle = gDialog.columnRuleStyleMenulist.value;
  var mozColumnRuleColor = gDialog.columnRuleColorpicker.color;

  var styles = {
    inline: true,
    embedded: true,
    values: [
              { property: "-moz-column-count",        value: mozColumnEnabled ? mozColumnCount : "" },
              { property: "-moz-column-width",        value: mozColumnEnabled ? mozColumnWidth : "" },
              { property: "-moz-column-gap",          value: mozColumnEnabled ? mozColumnGap : "" },
              { property: "-moz-column-rule-width",   value: mozColumnEnabled ? mozColumnRuleWidth : "" },
              { property: "-moz-column-rule-style",   value: mozColumnEnabled ? mozColumnRuleStyle : "" },
              { property: "-moz-column-rule-color",   value: mozColumnEnabled ? mozColumnRuleColor : "" }
            ]
  };
  return true;
}
