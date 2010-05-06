var gRv = null;
function Startup()
{
  
  GetUIElements();
  gRv = window.arguments[0];
}

function onAccept()
{
  document.persist("languageRadiogroup", "value");
  document.persist("doctypeRadiogroup", "value");
  document.persist("whereRadiogroup", "value");
  
  gRv.value = "k" +
              gDialog.languageRadiogroup.value +
              "_" +
              gDialog.doctypeRadiogroup.value;
  gRv.where = gDialog.whereRadiogroup.value;
}
