var gRv = null;
function Startup()
{
  
  GetUIElements();
  gRv = window.arguments[0];
}

function onAccept()
{

}

function SetColumnCount(aV)
{
  gDialog.columnCount.value = aV;
}