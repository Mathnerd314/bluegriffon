/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is BlueGriffon.
 *
 * The Initial Developer of the Original Code is
 * Disruptive Innovations SARL.
 * Portions created by the Initial Developer are Copyright (C) 2008-2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Daniel Glazman <daniel.glazman@disruptive-innovations.com>, Original author
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
 
var gMain = null;
var gModifiedTreeItem = null;
var gModifiedProjectId = -1;

function Startup()
{
  if (!window.arguments.length)
    return;

  var modifiedTreeItem = window.arguments[0];
  gModifiedTreeItem = modifiedTreeItem;

  GetUIElements();

  if (modifiedTreeItem)
  {
    var localStoreHome = modifiedTreeItem.getAttribute("localStoreHome");
    var url            = modifiedTreeItem.getAttribute("url");
    var storageChoice  = modifiedTreeItem.getAttribute("storageChoice");
    var hostname       = modifiedTreeItem.getAttribute("hostname");
    var rootpath       = modifiedTreeItem.getAttribute("rootpath");
    var user           = modifiedTreeItem.getAttribute("user");
    var pathhtml       = modifiedTreeItem.getAttribute("pathhtml");
    var pathmedia      = modifiedTreeItem.getAttribute("pathmedia");
    var pathJS         = modifiedTreeItem.getAttribute("pathJS");
    var pathCSS        = modifiedTreeItem.getAttribute("pathCSS");
    var name           = modifiedTreeItem.getAttribute("name");
    gModifiedProjectId = modifiedTreeItem.getAttribute("projectid");
    // HAVE TO QUERY PASSWORD...
    var password = LoginUtils.findPassword("ftp://" + hostname,
                                           null,
                                           "bluegriffon",
                                           user);

    gDialog.projectNameBox.value = name;
    gDialog.urlBox.value = url;
    gDialog.storageChoice.value = storageChoice;
    gDialog.localStoreHomeBox.value = localStoreHome;
    gDialog.hostnameBox.value = hostname;
    gDialog.rootpathBox.value = rootpath;
    gDialog.userBox.value = user;
    gDialog.passwordBox.value = password;
    gDialog.pathhtmlBox.value = pathhtml;
    gDialog.pathmediaBox.value = pathmedia;
    gDialog.pathJSBox.value = pathJS;
    gDialog.pathCSSBox.value = pathCSS;
  }
  else
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
  var statement;
  if (gModifiedTreeItem)
  {
    statement = dbConn.createStatement("UPDATE 'projects' SET name=?1,\
url=?2,\
storageChoice=?3,\
localStoreHome=?4,\
hostname=?5,\
rootpath=?6,\
user=?7,\
pathhtml=?8,\
pathmedia=?9,\
pathJS=?10,\
pathCSS=?11 WHERE id=?12");
    statement.bindUTF8StringParameter(11, gModifiedProjectId);
  }
  else
  {
    statement = dbConn.createStatement("INSERT INTO 'projects' ('name','url','storageChoice','localStoreHome','hostname','rootpath','user','pathhtml','pathmedia','pathJS','pathCSS') VALUES(?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)");
  }
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