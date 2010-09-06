function diChangeFileStylesheetTxn(aHref, aRule, aProperty, aValue, aPriority)
{
  this.mHref = aHref;
  this.mRule = aRule;
  this.mProperty = aProperty;
  this.mNewValue = aValue;
  this.mNewPriority = aPriority;
  this.mOldValue = "";
  this.mOldPriority = "";
}

diChangeFileStylesheetTxn.prototype = {

  QueryInterface : function(aIID)
  {
    if (aIID.equals(Components.interfaces.nsITransaction) ||
        aIID.equals(Components.interfaces.diIChangeFileStylesheetTxn) ||
        aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
        aIID.equals(Components.interfaces.nsISupports))
      return this;
    throw Components.results.NS_NOINTERFACE;
  },

  _serialize: function(aSheet, aHref)
  {
    var cssRules = aSheet.cssRules;
    var str = "";
    for (var i = 0; i < cssRules.length; i++)
    {
      var rule = cssRules[i];
      switch (rule.type)
      {
        case CssUtils.kCSSRule.STYLE_RULE:
          {
            str += (i ? "\n" : "") + rule.selectorText + " {\n " +
                   rule.style.cssText.replace( /;/g , ";\n");
            str += "}\n";
          }
          break;
        default:
          str += (i ? "\n" : "") + rule.cssText;
          break;
      }
    }

	  const classes             = Components.classes;
	  const interfaces          = Components.interfaces;
	  const nsILocalFile        = interfaces.nsILocalFile;
	  const nsIFileOutputStream = interfaces.nsIFileOutputStream;
	  const FILEOUT_CTRID       = '@mozilla.org/network/file-output-stream;1';

    var ios = Components.classes["@mozilla.org/network/io-service;1"]
                      .getService(Components.interfaces.nsIIOService)
    var handler = ios.getProtocolHandler("file");
    var fileHandler = handler.QueryInterface(Components.interfaces.nsIFileProtocolHandler);
	  var localFile = fileHandler.getFileFromURLSpec(this.mHref).QueryInterface(nsILocalFile);	
	  var fileOuputStream = classes[FILEOUT_CTRID].createInstance(nsIFileOutputStream);
	  try {
	    fileOuputStream.init(localFile, -1, -1, 0);
	
	    fileOuputStream.write(str, str.length);
	    fileOuputStream.close();
	  }
	  catch (ex) {}
  },

  doTransaction: function()
  {
    this.mOldValue    = this.mRule.style.getPropertyValue(this.mProperty);
    this.mOldPriority = this.mRule.style.getPropertyPriority(this.mProperty);
    if (this.mNewValue)
      this.mRule.style.setProperty(this.mProperty, this.mNewValue, this.mNewPriority);
    else
      this.mRule.style.removeProperty(this.mProperty);
    this._serialize(this.mRule.parentStyleSheet, this.mHref);
  },

  undoTransaction: function()
  {
    if (this.mOldValue)
      this.mRule.style.setProperty(this.mProperty, this.mOldValue, this.mOldPriority);
    else
      this.mRule.style.removeProperty(this.mProperty);
    this._serialize(this.mRule.parentStyleSheet, this.mHref);
  },

  redoTransaction: function()
  {
    this.doTransaction();
  },

  isTransient: false,

  merge: function(aTransaction)
  {
    return true;
  }
};
