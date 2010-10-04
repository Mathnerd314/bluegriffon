function Startup()
{
  var windowElt = document.documentElement;
  if (!windowElt.hasAttribute("width") &&
      !windowElt.hasAttribute("height"))
    window.sizeToContent();
}
