
function htmlParser(aIframe)
{
  this._iframe = aIframe;
}

htmlParser.prototype = {

  _iframe: null,
  _context: null,

  //Interfaces this component implements.
  interfaces: [Components.interfaces.nsIProgressEventSink,
               Components.interfaces.nsIInterfaceRequestor,
               Components.interfaces.nsISupports],

  // nsISupports

  QueryInterface: function(iid) {
    if (!this.interfaces.some( function(v) { return iid.equals(v) } ))
      throw Components.results.NS_ERROR_NO_INTERFACE;

    // nsIAuthPrompt and nsIPrompt need separate implementations because
    // their method signatures conflict.  The other interfaces we implement
    // within MicrosummaryResource itself.
    return this;

  },

  getInterface: function(iid) {
    return this.QueryInterface(iid);
  },


  parseHTML: function(aHtmlText, aUri, aCallback, aContext)
  {
    var iframe = this._iframe;
    if (!iframe.docShell)
      return;

    var webNav = iframe.docShell
                   .QueryInterface(Components.interfaces.nsIWebNavigation);
    webNav.stop(Components.interfaces.nsIWebNavigation.STOP_NETWORK);
  
    iframe.docShell.allowJavascript = false;
    iframe.docShell.allowAuth = false;
    iframe.docShell.allowPlugins = true;
    iframe.docShell.allowMetaRedirects = false;
    iframe.docShell.allowSubframes = true;
    iframe.docShell.allowImages = true;


    var parseHandler = {
      _self: this,
      _iframe: iframe,
      _context : aContext,
      _callback: aCallback,

      handleEvent: function(event) {
        this._iframe.removeEventListener("DOMContentLoaded", this, true);
        try
        { if (this._callback)
          this._callback(this._iframe.contentDocument, this._context);
        }
        finally { this._self = null }
      }
    };
  
    // Convert the HTML text into an input stream.
    var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
                    createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
    converter.charset = "UTF-8";
    var stream = converter.convertToInputStream(aHtmlText);
  
    // Set up a channel to load the input stream.
    var channel = Components.classes["@mozilla.org/network/input-stream-channel;1"].
                  createInstance(Components.interfaces.nsIInputStreamChannel);
    var IOService = Components.classes["@mozilla.org/network/io-service;1"]
                      .getService(Components.interfaces.nsIIOService);
    var uri = IOService.newURI(aUri, "utf-8", null);
    channel.setURI(uri);
    channel.contentStream = stream;
  
    // Load in the background so we don't trigger web progress listeners.
    var request = channel.QueryInterface(Components.interfaces.nsIRequest);
    request.loadFlags |= Components.interfaces.nsIRequest.LOAD_BACKGROUND;
  
    // Specify the content type since we're not loading content from a server,
    // so it won't get specified for us, and if we don't specify it ourselves,
    // then Gecko will prompt the user to download content of "unknown type".
    var baseChannel = channel.QueryInterface(Components.interfaces.nsIChannel);
    baseChannel.contentType = "text/html";
  
    // Load as UTF-8, which it'll always be, because XMLHttpRequest converts
    // the text (i.e. XMLHTTPRequest.responseText) from its original charset
    // to UTF-16, then the string input stream component converts it to UTF-8.
    baseChannel.contentCharset = "UTF-8";

    // Register the parse handler as a load event listener and start the load.
    // Listen for "DOMContentLoaded" instead of "load" because background loads
    // don't fire "load" events.
    iframe.addEventListener("DOMContentLoaded", parseHandler, true);
    var uriLoader = Components.classes["@mozilla.org/uriloader;1"].getService(Components.interfaces.nsIURILoader);
    uriLoader.openURI(channel, true, iframe.docShell);
  }

}