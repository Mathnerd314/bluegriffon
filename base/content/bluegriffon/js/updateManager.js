var BGUpdateManager = {

  kPREF_APPID:            "bluegriffon.updates.id",
  kPREF_LAST_UPDATE:      "blugriffon.updates.last",
  kPREF_UPDATES_ENABLED:  "bluegriffon.updates.check.enabled",
  kPREF_UPDATE_FREQUENCY: "bluegriffon.updates.frequency",
  kURL_UPDATE:            "http://bluegriffon.org/pings/bluegriffon_ping.php?",

  //Interfaces this component implements.
  interfaces: [Components.interfaces.nsIProgressEventSink,
               Components.interfaces.nsIInterfaceRequestor,
               Components.interfaces.nsISupports],

  // nsISupports

  QueryInterface: function(iid) {
    if (!this.interfaces.some( function(v) { return iid.equals(v) } ))
      throw Components.results.NS_ERROR_NO_INTERFACE;

    return this;
  },

  getInterface: function(iid) {
    return this.QueryInterface(iid);
  },

  check: function()
  {
    if (gDialog.updateThrobber)
      gDialog.updateThrobber.hidden = false;

    var prefs = GetPrefs();
    var currentDate = Date.parse(new Date());

    // we need an appId for the xmlhttprequest
    var appId = null;
    try {
      appId = prefs.getCharPref(this.kPREF_APPID);
    }
    catch(e) {}
    if (!appId) {
      var uuidService = Components.classes["@mozilla.org/uuid-generator;1"]
                          .getService(Components.interfaces.nsIUUIDGenerator);
      var uuid = uuidService.generateUUID().toString();
      appId = uuid + ":" + currentDate;
      try {
        prefs.setCharPref(this.kPREF_APPID, appId);
      }
      catch(e) {}
    }

    var lastCheck = 0;
    try {
      lastCheck = parseInt(prefs.getIntPref(this.kPREF_LAST_UPDATE));
    }
    catch(e) {}

    var updatesEnabled = true;
    try {
      updatesEnabled = prefs.getBoolPref(this.kPREF_UPDATES_ENABLED);
    }
    catch(e) {}

    var updateFrequency = "launch";
    try {
      updateFrequency = prefs.getCharPref(this.kPREF_UPDATE_FREQUENCY);
    }
    catch(e) {}

    if (updatesEnabled &&
        (updateFrequency == "launch" ||
         (updateFrequency == "onceperday" && currentDate - lastCheck > 24*60*60*1000))) {

      var gApp = Components.classes["@mozilla.org/xre/app-info;1"]
                   .getService(Components.interfaces.nsIXULAppInfo)
                   .QueryInterface(Components.interfaces.nsIXULRuntime);
      // ok we have to look for an app update...
      var rq = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
                 .createInstance();

      var loadHandler = {
        _self: this,
  
        handleEvent: function(aEvent)
        {
          if (this._self._loadTimer)
            this._self._loadTimer.cancel();
  
          this._self.status = aEvent.target.status;
  
          if (this._self._authFailer || this._self.status >= 400)
          {
            this._self = null;
            if (gDialog.updateThrobber)
              gDialog.updateThrobber.hidden = true;
            if ("ErrorOnUpdate" in window)
              ErrorOnUpdate();
          }
          else
          {
            try     { this._self._handleLoad(aEvent) }
            finally { this._self = null }
          }
        }
      };
  
      var errorHandler = {
        _self: this,
  
        handleEvent: function(event) {
          if (this._self._loadTimer)
            this._self._loadTimer.cancel();
  
          this._self = null;
          if (gDialog.updateThrobber)
            gDialog.updateThrobber.hidden = true;
          if ("ErrorOnUpdate" in window)
            ErrorOnUpdate();
        }
      };
      // cancel loads that take too long
      var timeout = 120 * 1000;
      var timerObserver = {
        _self: this,
        observe: function() {
          rq.abort();
          try     { this._self.destroy() }
          finally { this._self = null }
          if (gDialog.updateThrobber)
            gDialog.updateThrobber.hidden = true;
          if ("ErrorOnUpdate" in window)
            ErrorOnUpdate();
        }
      };
      this._loadTimer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
      this._loadTimer.init(timerObserver, timeout, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
  
      rq = rq.QueryInterface(Components.interfaces.nsIDOMEventTarget);
      rq.addEventListener("load", loadHandler, false);
      rq.addEventListener("error", errorHandler, false);
  
      rq = rq.QueryInterface(Components.interfaces.nsIXMLHttpRequest);
      rq.open("GET", this.kURL_UPDATE + "v=" + gApp.version
                                      + "&id=" + appId, true);
      rq.setRequestHeader("Pragma", "no-cache");
      rq.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
      // Register ourselves as a listener for notification callbacks so we
      // can handle authorization requests and SSL issues like cert mismatches.
      // XMLHttpRequest will handle the notifications we don't handle.
      rq.channel.notificationCallbacks = this;
  
      rq.send(null);
    }
  },

  _handleLoad: function(aEvent)
  {
    if (gDialog.updateThrobber)
      gDialog.updateThrobber.hidden = true;
    // update the last update's time
    GetPrefs().setIntPref(this.kPREF_LAST_UPDATE, Date.parse(new Date()));

    var rq = aEvent.target;
    var doc = rq.responseXML; 
    if (doc &&
        doc.documentElement.nodeName == "update") {
      var child = doc.documentElement.firstElementChild;
      var currentVersion, homeURL;
      while (child) {
        switch (child.nodeName)
        {
          case "currentVersion": currentVersion = child.textContent; break;
          case "homeURL":        homeURL = child.textContent; break;
          default:               break;
        }
        child = child.nextElementSibling;
      }
      if (currentVersion && homeURL) {
        var gApp = Components.classes["@mozilla.org/xre/app-info;1"]
                     .getService(Components.interfaces.nsIXULAppInfo)
                     .QueryInterface(Components.interfaces.nsIXULRuntime);
        var appVersionArray     = gApp.version.split(".");
        var currentVersionArray = currentVersion.split(".");
        for (var i = 0; i < Math.max(appVersionArray.length, currentVersionArray.length); i++) {
          var a = (i < appVersionArray.length)
                    ? parseInt(appVersionArray[i])
                    : 0;
          var c = (i < currentVersionArray.length)
                    ? parseInt(currentVersionArray[i])
                    : 0;
          if (c > i) {
            // aaaaah, we found a more recent version...
            var features = "chrome,titlebar,toolbar,modal,centerscreen,dialog=no";
            window.openDialog("chrome://bluegriffon/content/dialogs/updateAvailable.xul", "", features);
            return;
          }
        }
        if ("BlueGriffonIsUpToDate" in window)
          BlueGriffonIsUpToDate();
        return;
      }
    }
    if ("ErrorOnUpdate" in window)
      ErrorOnUpdate();
  }
};
