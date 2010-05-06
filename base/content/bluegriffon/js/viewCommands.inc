var cmdFullScreen =
{
  isCommandEnabled: function(aCommand, dummy)
  {
    return true;    // we can always do this
  },

  getCommandStateParams: function(aCommand, aParams, aRefCon) {},
  doCommandParams: function(aCommand, aParams, aRefCon) {},

  doCommand: function(aCommand)
  {
    window.fullScreen = !window.fullScreen;
    if (window.fullScreen)
    {
      window.document.documentElement.setAttribute("fullscreen", "true");

      gDialog["fullscr-grabber"].addEventListener("mousemove", function(){cmdFullScreen.showToolbars(true)}, false);
      gDialog.maincontainer.addEventListener("mousemove", function(){cmdFullScreen.showToolbars(false)}, false);
    }
    else
      window.document.documentElement.removeAttribute("fullscreen");
  },

  showToolbars: function(aShow)
  {
    if (aShow)
      window.document.documentElement.setAttribute("forcetoolbars", "true");
    else
      window.document.documentElement.removeAttribute("forcetoolbars");
  }
};

