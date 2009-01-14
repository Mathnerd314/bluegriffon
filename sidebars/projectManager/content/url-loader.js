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
 * The Original Code is Nvu.
 *
 * The Initial Developer of the Original Code is
 * Linspire Inc..
 * Portions created by the Initial Developer are Copyright (C) 2003-2005
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Daniel Glazman (glazman@disruptive-innovations.com), original author
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


const IOSERVICE_CTRID           = "@mozilla.org/network/io-service;1";
const cnsIIOService             = Components.interfaces.nsIIOService;
const SIS_CTRID                 = "@mozilla.org/scriptableinputstream;1"
const cnsIScriptableInputStream = Components.interfaces.nsIScriptableInputStream;
const cnsIChannel               = Components.interfaces.nsIChannel;
const cnsIInputStream           = Components.interfaces.nsIInputStream;
const cnsIRequest               = Components.interfaces.nsIRequest;
const cnsIDirectoryListing      = Components.interfaces.nsIDirectoryListing;

var gError;
var gCurrentChannel;

function _getChannelForURL (url)
{
    var serv = Components.classes[IOSERVICE_CTRID].getService(cnsIIOService);
    if (!serv)
        return null;
    
    return serv.newChannel(url, "UTF-8", null);

}

function StreamListener(channel, url, observer)
{
    this.channel = channel;
    this.data = "";
    this.url = url;
    this.observer = observer;
}

StreamListener.prototype.onStartRequest =
function (request, context)
{
}

StreamListener.prototype.onStopRequest =
function (request, context, status)
{
    // close the channel
    this.channel.cancel(0x804b0002); // NS_BINDING_ABORTED

    if (this.observer &&
        typeof this.observer.onComplete == "function")
        this.observer.onComplete (this.data, this.url, status);
}

StreamListener.prototype.onDataAvailable =
function (request, context, inStr, sourceOffset, count)
{
    // dump ("onDataAvailable(): " + count + "\n");
    // sometimes the inStr changes between onDataAvailable calls, so we
    // can't cache it.
    /*var sis = 
        Components.classes[SIS_CTRID].createInstance(cnsIScriptableInputStream);
    sis.init(inStr);
    var str = sis.read(count);*/
    var sis = Components.classes['@mozilla.org/binaryinputstream;1']
                            .createInstance(Components.interfaces.nsIBinaryInputStream);
    sis.setInputStream(inStr);
    var str = sis.readBytes(count);

    this.data += str;
}



function loadURLAsync (url, observer)
{
  var chan = _getChannelForURL (url);
  chan.loadFlags |= cnsIRequest.LOAD_BYPASS_CACHE;
  
  chan.contentType = "application/http-index-format";
  gCurrentChannel = chan;

  return chan.asyncOpen (new StreamListener (chan, url, observer), null);
}

function loadURL(url, caller)
{
  function onComplete(data, url, status)
    {
      if (status == Components.results.NS_OK)
      {
        if (caller.parseData)
          caller.parseData(data, caller.rqData);
        if (caller.endCallback)
          caller.endCallback(caller.rqData);
      }
      else if (caller.errorCallback)
        caller.errorCallback(url, status);
    };

  loadURLAsync (url, { onComplete: onComplete });
}

/*******************************/

function deleteURLAsync (url, treeitem)
{
  var chan = _getChannelForURL (url);
  chan.loadFlags |= cnsIRequest.LOAD_BYPASS_CACHE;

  chan instanceof Components.interfaces.nsIFTPChannel;
  var p = new progressListener(chan, FTP_DEL, url, null, treeitem)
  chan.notificationCallbacks = p.QueryInterface(Components.interfaces.nsIInterfaceRequestor) ;
  chan.deleteFile();
  gError = false;

  gCurrentChannel = chan;

  return chan.asyncOpen (new StreamListener (chan, url, null), null);
}

function removeDirURLAsync (url, treeitem)
{
  var chan = _getChannelForURL (url);
  chan.loadFlags |= cnsIRequest.LOAD_BYPASS_CACHE;

  chan instanceof Components.interfaces.nsIFTPChannel;
  var p = new progressListener(chan, FTP_RMDIR, url, null, treeitem)
  chan.notificationCallbacks = p.QueryInterface(Components.interfaces.nsIInterfaceRequestor) ;
  chan.removeDirectory();
  gError = false;

  gCurrentChannel = chan;

  return chan.asyncOpen (new StreamListener (chan, url, null), null);
}

function createDirURLAsync (url, aDirName, aRequestData)
{
  var chan = _getChannelForURL (url);
  chan.loadFlags |= cnsIRequest.LOAD_BYPASS_CACHE;

  chan instanceof Components.interfaces.nsIFTPChannel;
  var p = new progressListener(chan, FTP_MKDIR, url, aDirName, aRequestData)
  chan.notificationCallbacks = p.QueryInterface(Components.interfaces.nsIInterfaceRequestor) ;
  chan.createDirectory();
  gError = false;

  gCurrentChannel = chan;

  return chan.asyncOpen (new StreamListener (chan, url, null), null);
}

function renameURLAsync(url, aNewURI, aRequestData)
{
  var chan = _getChannelForURL(url);
  chan.loadFlags |= cnsIRequest.LOAD_BYPASS_CACHE;

  chan instanceof Components.interfaces.nsIFTPChannel;
  var p = new progressListener(chan, FTP_RENAME, url, aNewURI, aRequestData)
  chan.notificationCallbacks = p.QueryInterface(Components.interfaces.nsIInterfaceRequestor) ;
  chan.renameTo(aNewURI);
  gError = false;

  gCurrentChannel = chan;

  return chan.asyncOpen (new StreamListener (chan, url, null), null);
}

/**************************************/

function DropFtpConnection()
{
  if (gCurrentChannel)
    gCurrentChannel.cancel(0x804b0002); // NS_BINDING_ABORTED
}

function ForgetAboutLastFtpRequest()
{
  gCurrentChannel = null;
}

