var gRv = null;
function Startup()
{
  
  GetUIElements();
  gRv = window.arguments[0];
  onDoctypeToggle(gDialog.languageRadiogroup);
}

function onAccept()
{
  document.persist("languageRadiogroup", "value");
  document.persist("doctypeRadiogroup", "value");
  document.persist("whereRadiogroup", "value");
  
  gRv.value = "k" +
              gDialog.languageRadiogroup.value;
  if (gRv.value != "kHTML5" && gRv.value != "kXHTML5")
    gRv.value += "_" + gDialog.doctypeRadiogroup.value;
  gRv.where = gDialog.whereRadiogroup.value;

  GetPrefs().setCharPref("bluegriffon.defaults.doctype", gRv.value);
}

function onDoctypeToggle(aElt)
{
  var value = aElt.value;
  var isHtml5 = (value == "HTML5" || value == "XHTML5");
  SetEnabledElementAndControl(gDialog.transitionalRadio, !isHtml5);
  SetEnabledElementAndControl(gDialog.strictRadio, !isHtml5);
}