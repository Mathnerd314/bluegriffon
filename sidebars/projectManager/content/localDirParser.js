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
 
function GetLocalFileFromURLSpec(url)
{
  return GetFileFromURLSpec(url).QueryInterface(Components.interfaces.nsILocalFile);
}

function GetFileFromURLSpec(url)
{
  var fileHandler = UrlUtils.getFileProtocolHandler();
  return fileHandler.getFileFromURLSpec(url);
}

function OpenLocalDirectory(aUrl, aRQdata)
{
  ShowThrobber(true);
  var localFile = GetLocalFileFromURLSpec(aUrl);

  var firstNonDirEntry = null;
  
  var dirEntries = localFile.directoryEntries;
  var directoryEntries = new Array();
  var fileEntries      = new Array();
  while (dirEntries.hasMoreElements())
  {
    var fileEntry = dirEntries.getNext().QueryInterface(Components.interfaces.nsIFile);
    var rv = AddLocalDirSubdirs(aUrl, fileEntry, aRQdata, directoryEntries, fileEntries,
                                firstNonDirEntry);
    if (!firstNonDirEntry)
      firstNonDirEntry = rv;
  }
  ShowThrobber(false);
}


function AddLocalDirSubdirs(aUrl, aDirEntry, aRQdata, aDirectoryEntries, aFileEntries, aFirstNonDirEntry)
{
  var name = aDirEntry.leafName;
  var tc = aRQdata.getElementsByTagName("treechildren");
  var treechildren = null;
  if (tc && tc.length)
    treechildren = tc.item(0);
  else
  {
    treechildren = document.createElement("treechildren");
    aRQdata.appendChild(treechildren);
  }

  var size = aDirEntry.fileSize;
  var lastModifiedDate = new Date(aDirEntry.lastModifiedTime);
  var isDir = aDirEntry.isDirectory();

  var treeitem = document.createElement("treeitem");
  var treerow = document.createElement("treerow");
  var treecell1 = document.createElement("treecell");
  var treecell2 = document.createElement("treecell");
  var treecell3 = document.createElement("treecell");
  treecell1.setAttribute("label", name);
  treecell2.setAttribute("label", isDir ? "" : size);
  treecell3.setAttribute("label", GetNormalizedDate(lastModifiedDate));
  treeitem.setAttribute("lastModifiedTime", aDirEntry.lastModifiedTime);

  treerow.appendChild(treecell1);
  treerow.appendChild(treecell2);
  treerow.appendChild(treecell3);
  treeitem.appendChild(treerow);
  treeitem.setAttribute("name", name);

  var rv = null;
  treeitem.setAttribute("parentDir", aUrl);
  if (aDirEntry.isDirectory())
  {
    treeitem.setAttribute("container", "true");
    treeitem.setAttribute("localStoreHome", aUrl + name + "/");

    treechildren.insertBefore(treeitem, aFirstNonDirEntry);
  }
  else
  {
    treeitem.setAttribute("localStoreHome", aUrl + name);
    treechildren.appendChild(treeitem);
    rv = treeitem;
  }

  return rv;
}

