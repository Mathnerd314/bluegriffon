var gMain = null;

function Startup()
{
  GetUIElements();

  SetEnabledElement(document.documentElement.getButton("accept"), false);

  gMain = window.opener;
}

function onProjectNameChanged(aElt)
{
  var name = aElt.value;
  var okButton = document.documentElement.getButton("accept");
  if (!name)
  {
    SetEnabledElement(okButton, false);
    return;
  }

  var projects = gMain.gDialog.tableProjectsChildren.childNodes;
  var found = false;
  for (var i = 0 ; !found && i < projects.length; i++)
  {
    var p = projects[i];
    found = (p.getAttribute("name") == name);
  }
  SetEnabledElement(okButton, !found);
}

function Apply()
{
  var name = gDialog.projectNameBox.value;
  var url = gDialog.urlBox.value;
  var storageChoice = gDialog.storageChoice.value;
  var localStoreHome = gDialog.localStoreHomeBox.value;
  var hostname = gDialog.hostnameBox.value;
  var rootpath = gDialog.rootpathBox.value;
  var user = gDialog.userBox.value;
  var password = gDialog.passwordBox.value;
  var pathhtml = gDialog.pathhtmlBox.value;
  var pathmedia = gDialog.pathmediaBox.value;
  var pathJS = gDialog.pathJSBox.value;
  var pathCSS = gDialog.pathCSSBox.value;

  if (storageChoice != "local" && hostname && user && password)
  {
    var ftpUrl = "ftp://" + hostname;
    LoginUtils.addLogin(ftpUrl, user, password);
  }

  var dbConn = gMain.GetDBConn();
  var statement = dbConn.createStatement("INSERT INTO 'projects' ('name','url','storageChoice','localStoreHome','hostname','rootpath','user','pathhtml','pathmedia','pathJS','pathCSS') VALUES(?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)");

  statement.bindUTF8StringParameter(0, name);
  statement.bindUTF8StringParameter(1, url);
  statement.bindUTF8StringParameter(2, storageChoice);
  statement.bindUTF8StringParameter(3, localStoreHome);
  statement.bindUTF8StringParameter(4, hostname);
  statement.bindUTF8StringParameter(5, rootpath);
  statement.bindUTF8StringParameter(6, user);
  statement.bindUTF8StringParameter(7, pathhtml);
  statement.bindUTF8StringParameter(8, pathmedia);
  statement.bindUTF8StringParameter(9, pathJS);
  statement.bindUTF8StringParameter(10, pathCSS);
   
  statement.execute();
  statement.finalize();

  dbConn.close();

  deleteAllChildren(gMain.gDialog.tableProjectsChildren);
  gMain.ListProjects();
}

function onStorageChoice(aElt)
{
  switch (aElt.value)
  {
    case "ftp":
		  gDialog.localStoreGroupbox.setAttribute("hidden", "true");
		  gDialog.ftpAccessGroupbox.removeAttribute("hidden");
      break;
    case "copy":
	    gDialog.ftpAccessGroupbox.removeAttribute("hidden");
	    gDialog.localStoreGroupbox.removeAttribute("hidden");
      break;
    case "local":
	    gDialog.ftpAccessGroupbox.setAttribute("hidden", "true");
	    gDialog.localStoreGroupbox.removeAttribute("hidden");
      break;

    default: break; // should never happen
  }

  window.sizeToContent();
}