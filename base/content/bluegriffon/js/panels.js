var BlueGriffonPanels = {

  _captured: false,
  _captureX: 0,
  _captureY: 0,
  _initialW: 0,
  _initialH: 0,

  init: function()
  {
    var panels = document.querySelectorAll('panel[floating="true"]');
    for (var i = 0; i < panels.length; i++) {
      var panel = panels[i];
      var hbox = document.createElement("hbox");
      hbox.setAttribute("align", "center");
      hbox.className = "titleholder";
      var image = document.createElement("image");
      image.className = "floatingpanel-close";
      image.setAttribute("onclick", "BlueGriffonPanels.closePanel(this.parentNode.parentNode)");
      var titlebar = document.createElement("titlebar");
      titlebar.setAttribute("flex", "1");
      var label = document.createElement("label");
      label.setAttribute("value", panels[i].getAttribute("label"));
      titlebar.appendChild(label);
      hbox.appendChild(image);
      hbox.appendChild(titlebar);
      panel.insertBefore(hbox, panel.firstChild);

      hbox = document.createElement("hbox");
      //hbox.setAttribute("style", "width: 25px");
      hbox.setAttribute("align", "center");
      var spacer = document.createElement("spacer");
      spacer.setAttribute("flex", "1");
      var box = document.createElement("box");
      box.className = "resizer";
      box.setAttribute("onmousedown", "BlueGriffonPanels.captureMouse(event, this)");
      box.setAttribute("onmouseup", "BlueGriffonPanels.releaseMouse(event, this)");
      box.setAttribute("onmousemove", "BlueGriffonPanels.resizePanel(event, this)");
      hbox.appendChild(spacer);
      hbox.appendChild(box);
      panel.appendChild(box);

      if (true /*panel.getAttribute("open") == "true"*/) {
        var _self = panel;
        setTimeout(function() {
            BlueGriffonPanels.openPanel(_self, null, true);
            NotifierUtils.notify("redrawPanel", _self.id);
          }, 500);
      }
    }
  },

  openPanel: function(aPanel, aAnchorElement, aDoResize)
  {
	  try {
	    if (aAnchorElement)
	      aPanel.openPopup(aAnchorElement, "after_start", 0, 0,
	                     false, true);
	    else
	      aPanel.openPopup(document.documentElement, "start_before", 10, 10,
	                     false, true);
	    aPanel.setAttribute("open", "true");
	    document.persist(aPanel.id, "open");
	    if (aDoResize && aPanel.hasAttribute("width") && aPanel.hasAttribute("height"))
	      aPanel.sizeTo(aPanel.getAttribute("width"), aPanel.getAttribute("height"));
	    BlueGriffonVars.lastPanelRaised = aPanel;
	  } catch(e) {}
  },

  closePanel: function(aPanel)
  {
    aPanel.setAttribute("style", "opacity: 0");
    var _self = aPanel;
    setTimeout(function() {
        _self.hidePopup();
        _self.removeAttribute("style");
        _self.setAttribute("open", "false");
        document.persist(_self.id, "open");
      }, 500);
  },

  captureMouse: function(aEvent, aElt)
  {
    var panel = aElt.parentNode;
    var screenX = panel.boxObject.screenX;
    var screenY = panel.boxObject.screenY;
    panel.moveTo(screenX, screenY);
    if (!panel._captured)
    {
      BlueGriffonPanels._captured = true;
      BlueGriffonPanels._captureX = aEvent.clientX;
      BlueGriffonPanels._captureY = aEvent.clientY;
      BlueGriffonPanels._initialW = panel.boxObject.width;
      BlueGriffonPanels._initialH = panel.boxObject.height;
      aElt.setCapture(false);
    }
  },

  releaseMouse: function(aEvent, aElt)
  {
    var panel = aElt.parentNode;
    if (BlueGriffonPanels._captured)
    {
      BlueGriffonPanels._captured = false;
      aElt.releaseCapture();
      var dx = aEvent.clientX - BlueGriffonPanels._captureX;
      var dy = aEvent.clientY - BlueGriffonPanels._captureY;
      panel.sizeTo(BlueGriffonPanels._initialW + dx, BlueGriffonPanels._initialH + dy);
    }
  },

  resizePanel: function(aEvent, aElt)
  {
    var panel = aElt.parentNode;
    if (BlueGriffonPanels._captured)
    {
      var dx = aEvent.clientX - BlueGriffonPanels._captureX;
      var dy = aEvent.clientY - BlueGriffonPanels._captureY;
      panel.sizeTo( (BlueGriffonPanels._initialW + dx) , (BlueGriffonPanels._initialH + dy) );
    }

  }
};
