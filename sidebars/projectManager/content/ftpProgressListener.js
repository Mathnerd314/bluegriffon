const FTP_DEL    = 0;
const FTP_MKDIR  = 1;
const FTP_RMDIR  = 2;
const FTP_RENAME = 3;

function progressListener(aChannel, aAction, aUrl, aNewURI, aRequestData)
{
  this.startup(aChannel, aAction, aUrl, aNewURI, aRequestData);
}

progressListener.prototype =
{

  mChannel : null,
  mAction : null,
  mUrl : null,
  mNewURI : null,
  mRequestData : null,

  startup : function(aChannel, aAction, aUrl, aNewURI, aRequestData)
  {
    mChannel = aChannel;
    mAction = aAction;
    mUrl = aUrl;
    mNewURI = aNewURI;
    mRequestData = aRequestData;
  },

  onStatus : function(aRequest, aContext, aStatus, aStatusArg)
  {
    if (aStatus == 4915228)
    {
      if (!gError)
      {
        switch (mAction)
        {
          case FTP_DEL:
          case FTP_RMDIR:
            DeleteSelectedItem(mRequestData);
            break;
          case FTP_MKDIR:
            AppendNewRemoteDir(mUrl, mRequestData);
            break;
          case FTP_RENAME:
            RenameTo(mNewURI, mRequestData);
            break;
          default:
            break;
        }
      }
      // close the channel
      mChannel.cancel(0x804b0002); // NS_BINDING_ABORTED
      OnFtpEnd(null);
    }
  },

  onProgress : function(aRequest, aContext,
                        aProgress, aProgressMax)
  {
  },

  QueryInterface : function(aIID)
  {
    if (aIID.equals(Components.interfaces.nsIProgressEventSink)
    || aIID.equals(Components.interfaces.nsISupports)
    || aIID.equals(Components.interfaces.nsIFTPEventSink)
    || aIID.equals(Components.interfaces.nsIInterfaceRequestor)
    || aIID.equals(Components.interfaces.nsISupports)
    || aIID.equals(Components.interfaces.nsISupportsWeakReference)
    || aIID.equals(Components.interfaces.nsIPrompt)
    || aIID.equals(Components.interfaces.nsIAuthPrompt))
      return this;
    throw Components.results.NS_NOINTERFACE;
  },

  getInterface : function(aIID)
  {
    if (aIID.equals(Components.interfaces.nsIProgressEventSink)
    || aIID.equals(Components.interfaces.nsISupports)
    || aIID.equals(Components.interfaces.nsIFTPEventSink)
    || aIID.equals(Components.interfaces.nsIInterfaceRequestor)
    || aIID.equals(Components.interfaces.nsISupports)
    || aIID.equals(Components.interfaces.nsISupportsWeakReference)
    || aIID.equals(Components.interfaces.nsIPrompt)
    || aIID.equals(Components.interfaces.nsIAuthPrompt))
      return this;
    throw Components.results.NS_NOINTERFACE;
  },

// nsIPrompt
  alert : function(dlgTitle, text)
  {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService);
    promptService.alert(window, dlgTitle, text);
    gError = true;
  },
  alertCheck : function(dialogTitle, text, checkBoxLabel, checkObj)
  {
  },
  confirm : function(dlgTitle, text)
  {
  },
  confirmCheck : function(dlgTitle, text, checkBoxLabel, checkObj)
  {
  },
  confirmEx : function(dlgTitle, text, btnFlags, btn0Title, btn1Title, btn2Title, checkBoxLabel, checkVal)
  {
  },
  prompt : function(dlgTitle, text, inoutText, checkBoxLabel, checkObj)
  {
  },
  promptPassword : function(dlgTitle, text, pwObj, checkBoxLabel, savePWObj)
  {
  },
  promptUsernameAndPassword : function(dlgTitle, text, userObj, pwObj, checkBoxLabel, savePWObj)
  {
  },
  select : function(dlgTitle, text, count, selectList, outSelection)
  {
  },

  OnFTPControlLog : function(server, msg)
  {
  },
}
