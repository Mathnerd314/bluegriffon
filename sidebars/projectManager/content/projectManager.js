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
 * Portions created by the Initial Developer are Copyright (C) 2008
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

// cf. netwerk/bas/public/nsNetError.h
const ERROR_FTP_LOGIN  = 2152398869;
const ERROR_FTP_CWD    = 2152398870;
const ERROR_FTP_PASV   = 2152398871;
const ERROR_FTP_PWD    = 2152398872;
const ERROR_FTP_LIST   = 2152398873;

function GetDBConn()
{
  var file = Components.classes["@mozilla.org/file/directory_service;1"]
                       .getService(Components.interfaces.nsIProperties)
                       .get("ProfD", Components.interfaces.nsIFile);
  file.append("webprojects.sqlite");
  
  var storageService = Components.classes["@mozilla.org/storage/service;1"]
                          .getService(Components.interfaces.mozIStorageService);
  return storageService.openDatabase(file);
}

function Startup()
{
  GetUIElements();
  ShowThrobber(true);

  if (window.top &&
      "NotifierUtils" in window.top)
    gMain = window.top;
  else if (window.top && window.top.opener &&
           "NotifierUtils" in window.top.opener)
    gMain = window.top.opener;

  if (!gMain)
    return;

  ListProjects();
  ShowThrobber(false);
}

function ListProjects()
{
  var PM = gMain.ProjectsManager;
  PM.loadProjectsFromDB();
  var projects = PM.currentProjects;

  for (var i = 0; i < projects.length; i++) {
    var p = projects[i];

    var id             = p.id;
    var name           = p.name;
    var url            = p.url;
    var storageChoice  = p.storageChoice;
    var localStoreHome = p.localStoreHome;
    var hostname       = p.hostname;
    var rootpath       = p.rootpath;
    var user           = p.user;
    var pathhtml       = p.pathhtml;
    var pathmedia      = p.pathmedia;
    var pathJS         = p.pathJS;
    var pathCSS        = p.pathCSS;

    var treeitem = document.createElement("treeitem");
    var treerow = document.createElement("treerow");
    var treecell = document.createElement("treecell");
    treecell.setAttribute("label", name);
    treerow.appendChild(treecell);
    treeitem.appendChild(treerow);
    treeitem.setAttribute("container", "true");

    treeitem.setAttribute("localStoreHome", localStoreHome);
    treeitem.setAttribute("url", url);
    treeitem.setAttribute("storageChoice", storageChoice);
    treeitem.setAttribute("hostname", hostname);
    treeitem.setAttribute("rootpath", rootpath);
    treeitem.setAttribute("user", user);
    treeitem.setAttribute("pathhtml", pathhtml);
    treeitem.setAttribute("pathmedia", pathmedia);
    treeitem.setAttribute("pathJS", pathJS);
    treeitem.setAttribute("pathCSS", pathCSS);

    treeitem.setAttribute("name", name);

    gDialog.tableProjectsChildren.appendChild(treeitem);
  }

  gDialog.tableProjects.addEventListener("DOMAttrModified", onContainerOpened, false);

}

function Shutdown()
{
  gDialog.tableProjects.removeEventListener("DOMAttrModified", onContainerOpened, false);
}

function onContainerOpened(aEvent)
{
  var treeitem = aEvent.target;
  var attrChange = aEvent.attrChange;
  var attrName = aEvent.attrName;
  var newValue = aEvent.newValue;
  if (attrName != "open" || newValue == "false")
    return;

  var tc = treeitem.getElementsByTagName("treechildren");
  if (treeitem.getAttribute("localStoreHome")) // LOCAL
  {
    if (!tc || !tc.length)
      OpenLocalDirectory(treeitem.getAttribute("localStoreHome"), aEvent.target);
  }
  else // REMOTE SITE
  {
    if (tc && tc.length)
      return;

    var url = GetRemoteUrl(treeitem);
    ShowThrobber(true);
    var foo = new FTPDirParser(url,
                               treeitem,
                               AddFTPDirSubdirs, OnFtpEnd, OnFtpError);
  }
  
}

function GetRemoteUrl(aTreeItem)
{
  var hostname = aTreeItem.getAttribute("hostname");
  var user = aTreeItem.getAttribute("user");
  var rootpath = aTreeItem.getAttribute("rootpath");
  var password = LoginUtils.findPassword("ftp://" + hostname,
                                         null,
                                         "bluegriffon",
                                         user);

  return "ftp://" + (user ? user + ":" + password + "@" : "") +
         hostname +
         (rootpath[0] == '/' ? "" : "/") +
         rootpath;
}

function AddFTPDirSubdirs(url, dirEntry, aRQdata)
{
  var name = dirEntry.location
  var size = dirEntry.size;
  var lastModifiedDate = new Date(dirEntry.description);
  var type = dirEntry.type;

  var tc = aRQdata.getElementsByTagName("treechildren");
  var treechildren = null;
  if (tc && tc.length)
    treechildren = tc.item(0);
  else
  {
    treechildren = document.createElement("treechildren");
    aRQdata.appendChild(treechildren);
  }

  var isDir = (type == Components.interfaces.nsIDirIndex.TYPE_DIRECTORY);
  var hostname = aRQdata.getAttribute("hostname");
  var rootpath = (aRQdata.getAttribute("rootpath") + "/" + name);
  var user = aRQdata.getAttribute("user");

  var treeitem = document.createElement("treeitem");
  var treerow = document.createElement("treerow");
  var treecell1 = document.createElement("treecell");
  var treecell2 = document.createElement("treecell");
  var treecell3 = document.createElement("treecell");
  treecell1.setAttribute("label", name);
  treecell2.setAttribute("label", isDir ? "" : size);
  treecell3.setAttribute("label", GetNormalizedDate(lastModifiedDate));
  treeitem.setAttribute("lastModifiedTime", lastModifiedDate);

  treerow.appendChild(treecell1);
  treerow.appendChild(treecell2);
  treerow.appendChild(treecell3);
  treeitem.appendChild(treerow);
  treeitem.setAttribute("name", name);
  treeitem.setAttribute("hostname", hostname);
  treeitem.setAttribute("rootpath", rootpath);
  treeitem.setAttribute("user", user);

  if (isDir)
  {
    treeitem.setAttribute("container", "true");

    var child = treechildren.firstChild;
    while (child &&
           child.getAttribute("name") <= name &&
           child.hasAttribute("container"))
      child = child.nextSibling;
    
    treechildren.insertBefore(treeitem, child);
  }
  else
  {
    treechildren.appendChild(treeitem);
  }
}

function OnFtpEnd(aReqData)
{
  ShowThrobber(false);
}

function OnFtpError(aUrl, aStatus)
{
  ShowThrobber(false);
  var message = "";
  if (status == ERROR_FTP_LOGIN)
    message = gDialog.projectManagerBundle.getString("FtpLoginError");
  else if (status == ERROR_FTP_CWD)
    message = gDialog.projectManagerBundle.getString("FtpCwdError");
  else
    message = gDialog.projectManagerBundle.getString("FtpUnknownError");

  PromptUtils.alertWithTitle("FTP", message, window.top);

}

function OpenAddProjectDialog()
{
  window.openDialog("chrome://projectmanager/content/projectProperties.xul", "",
                    "modal, centerscreen, resizable=no", null);
}

function RefreshEntry()
{
  var tree = gDialog.tableProjects;
  var contentView = tree.contentView;
  var view = tree.view;
  var index = view.selection.currentIndex;
  var treeitem = contentView.getItemAtIndex(index);
  if (treeitem.getAttribute("container") == "true")
  {
    var tc = treeitem.getElementsByTagName("treechildren");
    if (tc && tc.length)
      treeitem.removeChild(tc.item(0));
    if (treeitem.getAttribute("localStoreHome"))
      OpenLocalDirectory(treeitem.getAttribute("localStoreHome"), treeitem);
    else
    {
      var hostname = treeitem.getAttribute("hostname");
      var user = treeitem.getAttribute("user");
      var rootpath = treeitem.getAttribute("rootpath");
      var password = LoginUtils.findPassword("ftp://" + hostname,
                                             null,
                                             "bluegriffon",
                                             user);
  
      var url = "ftp://" + (user ? user + ":" + password + "@" : "") +
                hostname + "/" + rootpath;
  
      ShowThrobber(true);
      var foo = new FTPDirParser(url,
                                 treeitem,
                                 AddFTPDirSubdirs, OnFtpEnd, OnFtpError);
    }
  }
  else if (treeitem.getAttribute("localStoreHome"))
  {
    var localFile = GetLocalFileFromURLSpec(treeitem.getAttribute("localStoreHome"));
    if (!localFile)
    {
      treeitem.parentNode.removeChild(treeitem);
      return;
    }
    var fileEntry = localFile.QueryInterface(Components.interfaces.nsIFile);
    var size = localFile.fileSize;
    var lastModifiedDate = new Date(localFile.lastModifiedTime);
    var isDir = localFile.isDirectory();

    var treerow = treeitem.firstChild;
    deleteAllChildren(treerow);
    var treecell1 = document.createElement("treecell");
    var treecell2 = document.createElement("treecell");
    var treecell3 = document.createElement("treecell");
    treecell1.setAttribute("label", treeitem.getAttribute("name"));
    treecell2.setAttribute("label", isDir ? "" : size);
    treecell3.setAttribute("label", GetNormalizedDate(lastModifiedDate));
    treerow.appendChild(treecell1);
    treerow.appendChild(treecell2);
    treerow.appendChild(treecell3);
    treeitem.setAttribute("lastModifiedTime", localFile.lastModifiedTime);
  }
}

function GetNormalizedDate(aDate)
{
  var rv = aDate.getFullYear() + "-";

  var month = aDate.getMonth() + 1;
  rv += gDialog.projectManagerBundle.getString("month" + month) + "-";

  var day = aDate.getDate();
  rv += ((day < 10) ? "0" + day : day) + " ";

  var hours = aDate.getHours();
  rv += ((hours < 10) ? "0" + hours : hours) + ":";
  var mns = aDate.getMinutes();
  rv += ((mns < 10) ? "0" + mns : mns) + ":";
  var secs = aDate.getSeconds();
  rv += ((secs < 10) ? "0" + secs : secs);

  return rv;
}

function OnDblCLick()
{
  var tree = gDialog.tableProjects;
  var contentView = tree.contentView;
  var view = tree.view;
  var count = view.selection.count;
  if (!count) // no selection...
    return;

  var index = view.selection.currentIndex;
  var treeitem = contentView.getItemAtIndex(index);

  if (treeitem.hasAttribute("container")) // it's a folder
    return;

  var spec = treeitem.getAttribute("localStoreHome");
  if (!spec)
    spec = GetRemoteUrl(treeitem);
  var uri = UrlUtils.newURI(spec);
  var extension = uri.QueryInterface(Components.interfaces.nsIURL).fileExtension;
  ActionCaller(spec, extension);
}

function ActionCaller(aSpec, aExt)
{
  ShowThrobber(true);
  switch (aExt)
  {
    case "html":
    case "htm":
      gMain.OpenFile(aSpec, true);
      break;
    default:
      UrlUtils.makeRelativeUrl(aSpec);
      break;
  }
  ShowThrobber(false);
}

function ShowThrobber(aShow)
{
  if (!gDialog.ProjectThrobberButton)
    return;
  if (aShow)
  {
    gDialog.ProjectThrobberButton.removeAttribute("hidden");
    gDialog.tableProjects.disabled = true;
    gDialog.tableProjects.style.cursor = "wait";
  }
  else
  {
    gDialog.ProjectThrobberButton.setAttribute("hidden", "true");
    gDialog.tableProjects.disabled = false;
    gDialog.tableProjects.style.cursor = "auto";
  }
}

function DeleteFileOrDir()
{
  var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                      .getService(Components.interfaces.nsIPromptService);

  if (!promptService.confirm(window, gDialog.projectManagerBundle.getString("ConfirmDeletion"),
                             gDialog.projectManagerBundle.getString("SureToDelete")))
    return;

  var tree = gDialog.tableProjects;
  var contentView = tree.contentView;
  var view = tree.view;
  if (!view.selection.count)
    return;
  var index = view.selection.currentIndex;
  var treeitem = contentView.getItemAtIndex(index);

  // is the user trying to delete a project ?
  if (treeitem.parentNode.parentNode.nodeName.toLowerCase() == "tree")
  {
    alert("project deletion requested");
  }
  else if (treeitem.getAttribute("localStoreHome"))
  {
    if (treeitem.hasAttribute("container")) // is it a directory ?
      RemoveLocalDir(treeitem.getAttribute("localStoreHome"), treeitem);
    else
      RemoveLocalFile(treeitem.getAttribute("localStoreHome"), treeitem);
  }
  else
  {
    var hostname = treeitem.getAttribute("hostname");
    var user = treeitem.getAttribute("user");
    var rootpath = treeitem.getAttribute("rootpath");
    var password = LoginUtils.findPassword("ftp://" + hostname,
                                           null,
                                           "bluegriffon",
                                           user);

    var url = "ftp://" + (user ? user + ":" + password + "@" : "") +
              hostname + "/" + rootpath;

    ShowThrobber(true);
    if (treeitem.hasAttribute("container")) // is it a directory ?
      removeDirURLAsync(url, treeitem);
    else
      deleteURLAsync(url, treeitem);
  }
}

function RemoveLocalFile(aSpec, aTreeitem)
{
  // get a reference to the prompt service component.
  var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                      .getService(Components.interfaces.nsIPromptService);

  if (promptService.confirm(window, gDialog.projectManagerBundle.getString("ConfirmDeletion"),
                            gDialog.projectManagerBundle.getString("SureToDelete")))
  {
    if (IsFileUrl(aSpec)) // sanity check
    {
      var localFile = GetLocalFileFromURLSpec(aSpec);
      localFile.remove(false);
      DeleteSelectedItem(aTreeitem);
    }
  }
}

function DeleteSelectedItem(aItem)
{
  aItem.parentNode.removeChild(aItem);
}

function IsFileUrl(url)
{
  return (url.substr(0,4) == "file");
}

function RemoveLocalDir(aSpec, aTreeitem)
{
  // get a reference to the prompt service component.
  var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                      .getService(Components.interfaces.nsIPromptService);

  if (promptService.confirm(window,
                            gDialog.projectManagerBundle.getString("ConfirmDirRemoval"),
                            gDialog.projectManagerBundle.getString("SureToRemoveDir")))
  {
    if (IsFileUrl(aSpec)) // sanity check
    {
      var localFile = GetLocalFileFromURLSpec(aSpec);
      var dirEntries = localFile.directoryEntries;
      var removeAll = false;
      if (dirEntries.hasMoreElements())
      {
        while (dirEntries.hasMoreElements())
          var junk = dirEntries.getNext();

        if (promptService.confirm(window,
                                  gDialog.projectManagerBundle.getString("RemoveDirAlert"),
                                  gDialog.projectManagerBundle.getString("DirNotEmptyAlert")))
          removeAll = true;

      }
      localFile.remove(removeAll);
      aTreeitem.parentNode.removeChild(aTreeitem);
    }
  }
}

function TweakTableProjectsPopup()
{
  NotifierUtils.notify("treePopupShowing");

  var tree = gDialog.tableProjects;
  var contentView = tree.contentView;
  var view = tree.view;
  if (!view.selection.count) // No selection yet in the tree
  {
    SetEnabledElement(gDialog.refreshMenuItem, false);
    SetEnabledElement(gDialog.deleteMenuItem, false);
    SetEnabledElement(gDialog.newDirMenuItem, false);
    SetEnabledElement(gDialog.renameMenuItem, false);
    return;
  }
  var index = view.selection.currentIndex;
  var treeitem = contentView.getItemAtIndex(index);

  // the selection is a project, not a file or a dir
  if (treeitem.parentNode.parentNode.nodeName.toLowerCase() == "tree")
  {
    SetEnabledElement(gDialog.refreshMenuItem, true);
    SetEnabledElement(gDialog.deleteMenuItem, false);
    SetEnabledElement(gDialog.newDirMenuItem, true);
    SetEnabledElement(gDialog.renameMenuItem, false);
    return;
  }

  // finally, we have a file or a dir selected in the tree
  SetEnabledElement(gDialog.refreshMenuItem, true);
  SetEnabledElement(gDialog.deleteMenuItem, true);
  SetEnabledElement(gDialog.newDirMenuItem, true);
  SetEnabledElement(gDialog.renameMenuItem, true);

}

function MakeNewDir()
{
  var tree = gDialog.tableProjects;
  var contentView = tree.contentView;
  var view = tree.view;
  if (!view.selection.count)
    return;

  var index = view.selection.currentIndex;
  var treeitem = contentView.getItemAtIndex(index);

  if (!treeitem.hasAttribute("container"))
    treeitem = treeitem.parentNode.parentNode;

  // get a reference to the prompt service component.
  var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                      .getService(Components.interfaces.nsIPromptService);

  var result = {value:null};
  if (promptService.prompt(window,
                           gDialog.projectManagerBundle.getString("ConfirmDirCreation"),
                           gDialog.projectManagerBundle.getString("EnterDirName"),
                           result,
                           null,
                           {value:0}))
  {
    var url = treeitem.getAttribute("localStoreHome");
    if (IsFileUrl(url))
    {
      file = GetFileFromURLSpec(url);
      file.append(result.value);
      file.create(1, 755);
      url += result.value;
      AppendNewLocalDir(url, file.leafName, treeitem);
    }
    else
    {
      url = GetRemoteUrl(treeitem) + "/" + result.value;
      var URL = GetURLFromUrl(url);
      createDirURLAsync(url, URL.filePath, treeitem);
    }
  }
}

function Rename()
{
  var tree = gDialog.tableProjects;
  var contentView = tree.contentView;
  var view = tree.view;
  if (!view.selection.count)
    return;

  var index = view.selection.currentIndex;
  var treeitem = contentView.getItemAtIndex(index);
  var name = treeitem.getAttribute("name");

  // get a reference to the prompt service component.
  var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                      .getService(Components.interfaces.nsIPromptService);

  var result = {value: name};
  if (promptService.prompt(window,
                           gDialog.projectManagerBundle.getString("FileOrDirRenaming"),
                           gDialog.projectManagerBundle.getString("FileOrDirRenamingPrompt"),
                           result,
                           null,
                           {value:0}) &&
      name != result.value)
  {
    // ok, user did not cancel and we have a new name for the file/directory
    var parentDir = treeitem.getAttribute("parentDir");
    if (treeitem.getAttribute("localStoreHome")) // LOCAL
    {
      var localFile = GetLocalFileFromURLSpec(treeitem.getAttribute("localStoreHome"));
      try {
        localFile.moveTo(null, result.value);
      }
      catch(e) {
        // something wrent wrong, we can't rename that file or dir
        PromptUtils.alertWithTitle(gDialog.projectManagerBundle.getString("Rename"),
                                   gDialog.projectManagerBundle.getString("ErrorOnRename"),
                                   window);
        return;
      }

      var newName = parentDir + result.value;
      if (treeitem.hasAttribute("container"))
        newName += "/";
      treeitem.setAttribute("localStoreHome", newName);
      treeitem.setAttribute("name", result.value);

      var mainCell = treeitem.firstChild.firstChild;
      var dateCell = mainCell.nextSibling.nextSibling;
      mainCell.setAttribute("label", result.value);
    }
    else
    {
      var url = GetRemoteUrl(treeitem);
      var URL = GetURLFromUrl(url);
      // do we deal with a UTF-8 name or a special charset like windows1252 ?
      if (L10NUtils.convertStringToUTF8(url))
      {
        url = URL.spec;
      }
      /*else
      {
        URL.fileName = "";
        url = URL.spec + escape(treeitem.getAttribute("name"));
      }*/
      URL.fileName = result.value;
      ShowThrobber(true);
      renameURLAsync(url, URL, treeitem);
    }
  }
}

function RenameTo(aNewURI, aTreeitem)
{
  var filename = L10NUtils.convertStringToUTF8(unescape(aNewURI.fileName)) ||
                 unescape(aNewURI.fileName);
  aTreeitem.setAttribute("rootpath", aTreeitem.parentNode.parentNode.getAttribute("rootpath") + "/" + filename);

  var mainCell = aTreeitem.firstChild.firstChild;
  var dateCell = mainCell.nextSibling.nextSibling;
  mainCell.setAttribute("label", filename);
  aTreeitem.setAttribute("name", filename);
}

function GetURLFromUrl(url)
{
  try {
    var URL = Components.classes["@mozilla.org/network/standard-url;1"].createInstance(Components.interfaces.nsIURL);
    URL.spec = url;
    return URL;
  } catch (e) {
    return null;
  }
}

function AppendNewLocalDir(aSpec, aFileName, aTreeitem)
{
  var treechildren = null;
  if (aTreeitem.lastChild &&
      aTreeitem.lastChild.nodeName.toLowerCase() == "treechildren")
    treechildren = aTreeitem.lastChild
  else
  {
    treechildren = document.createElement("treechildren");
    aTreeitem.appendChild(treechildren);
  }

  var child = treechildren.firstChild;
  while (child &&
         child.getAttribute("localStoreHome") <= aSpec &&
         child.hasAttribute("container"))
    child = child.nextSibling;

  var treeitem = document.createElement("treeitem");
  var treerow = document.createElement("treerow");
  var treecell1 = document.createElement("treecell");
  var treecell2 = document.createElement("treecell");
  var treecell3 = document.createElement("treecell");
  treecell1.setAttribute("label", aFileName);
  treecell2.setAttribute("label", "");
  var lastModTime = new Date();
  treecell3.setAttribute("label", GetNormalizedDate(lastModTime));
  treeitem.setAttribute("lastModifiedTime", lastModTime);

  treerow.appendChild(treecell1);
  treerow.appendChild(treecell2);
  treerow.appendChild(treecell3);
  treeitem.appendChild(treerow);
  treeitem.setAttribute("name", aFileName);

  treeitem.setAttribute("container", "true");
  treeitem.setAttribute("localStoreHome", aSpec + "/");

  treechildren.insertBefore(treeitem, child);

  var tree = gDialog.tableProjects;
  var contentView = tree.contentView;
  var view = tree.view;

  var index = contentView.getIndexOfItem(treeitem);
  view.selection.select(index);
}

function StopFtpConnection()
{
  DropFtpConnection();
  ForgetAboutLastFtpRequest();
  ShowThrobber(false);
}

function AppendNewRemoteDir(aSpec, aTreeitem)
{
  var URL = GetURLFromUrl(aSpec);
  var fileName = L10NUtils.convertStringToUTF8(unescape(URL.fileName)) ||
                 unescape(URL.fileName);
  var rootpath = aTreeitem.getAttribute("rootpath") + "/" + fileName;

  var hostname = aTreeitem.getAttribute("hostname");
  var user = aTreeitem.getAttribute("user");

  var treechildren = null;
  if (aTreeitem.lastChild &&
      aTreeitem.lastChild.nodeName.toLowerCase() == "treechildren")
    treechildren = aTreeitem.lastChild
  else
  {
    treechildren = document.createElement("treechildren");
    aTreeitem.appendChild(treechildren);
  }

  var child = treechildren.firstChild;
  while (child &&
         child.getAttribute("rootpath") <= rootpath &&
         child.hasAttribute("container"))
    child = child.nextSibling;

  var treeitem = document.createElement("treeitem");
  var treerow = document.createElement("treerow");
  var treecell1 = document.createElement("treecell");
  var treecell2 = document.createElement("treecell");
  var treecell3 = document.createElement("treecell");
  treecell1.setAttribute("label", fileName);
  treecell2.setAttribute("label", "");
  var lastModTime = new Date();
  treecell3.setAttribute("label", GetNormalizedDate(lastModTime));
  treeitem.setAttribute("lastModifiedTime", lastModTime);

  treerow.appendChild(treecell1);
  treerow.appendChild(treecell2);
  treerow.appendChild(treecell3);
  treeitem.appendChild(treerow);
  treeitem.setAttribute("name", fileName);
  treeitem.setAttribute("hostname", hostname);
  treeitem.setAttribute("rootpath", rootpath);
  treeitem.setAttribute("user", user);
  treeitem.setAttribute("container", "true");

  treechildren.insertBefore(treeitem, child);

  var tree = gDialog.tableProjects;
  var contentView = tree.contentView;
  var view = tree.view;

  var index = contentView.getIndexOfItem(treeitem);
  view.selection.select(index);
}
