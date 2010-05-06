function loadExternalURL( url )
{
  if (url)
  {
    var ioService = Components.classes["@mozilla.org/network/io-service;1"]
                              .getService(Components.interfaces.nsIIOService);
    var uri = ioService.newURI(url, null, null);
    var extProtocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
                                   .getService(Components.interfaces.nsIExternalProtocolService);

    extProtocolSvc.loadUrl(uri);
  }
}

function ShowUpdatePage()
{
  loadExternalURL("http://bluegriffon.org/pages/Download");
  window.close();
}