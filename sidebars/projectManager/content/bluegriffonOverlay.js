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
 
 var ProjectsManager = {

  currentProjects: [],

  getDBConn: function webchunks_getDBConn()
  {
    var file = Components.classes["@mozilla.org/file/directory_service;1"]
                         .getService(Components.interfaces.nsIProperties)
                         .get("ProfD", Components.interfaces.nsIFile);
    file.append("webprojects.sqlite");
    
    var storageService = Components.classes["@mozilla.org/storage/service;1"]
                            .getService(Components.interfaces.mozIStorageService);
    return storageService.openDatabase(file);
  },

  init: function()
  {
    var mDBConn = this.getDBConn();    
    mDBConn.executeSimpleSQL("CREATE TABLE IF NOT EXISTS 'projects' ('id' INTEGER PRIMARY KEY NOT NULL, \
'name' VARCHAR NOT NULL, \
'url' VARCHAR NOT NULL, \
'storageChoice' VARCHAR NOT NULL, \
'localStoreHome' VARCHAR NOT NULL, \
'hostname' VARCHAR NOT NULL, \
'rootpath' VARCHAR NOT NULL, \
'user' VARCHAR NOT NULL, \
'pathhtml' VARCHAR NOT NULL, \
'pathmedia' VARCHAR NOT NULL, \
'pathJS' VARCHAR NOT NULL, \
'pathCSS' VARCHAR NOT NULL)");
    mDBConn.close();

  },

  loadProjectsFromDB: function()
  {
    this.currentProjects = [];

    var dbConn = this.getDBConn();
    var statement = dbConn.createStatement("SELECT * from projects");
    
    while (statement.executeStep()) {
      var id = statement.getInt32(0);
      var name = statement.getString(1);
      var url = statement.getString(2);
      var storageChoice = statement.getString(3);
      var localStoreHome = statement.getString(4);
      var hostname = statement.getString(5);
      var rootpath = statement.getString(6);
      var user = statement.getString(7);
      var pathhtml = statement.getString(8);
      var pathmedia = statement.getString(9);
      var pathJS = statement.getString(10);
      var pathCSS = statement.getString(11);
  
      this.currentProjects.push( {
        id: id,
        name: name,
        url: url,
        storageChoice: storageChoice,
        localStoreHome: localStoreHome,
        hostname: hostname,
        rootpath: rootpath,
        user: user,
        pathhtml: pathhtml,
        pathmedia: pathmedia,
        pathJS: pathJS,
        pathCSS: pathCSS
      });
    }
  
    statement.finalize();
    dbConn.close();

  }
};

ProjectsManager.init();
