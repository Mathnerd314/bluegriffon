var ColorPickerHelper = {

// MEMBERS

  mPersistentColorObjects: {},

// CONSTANTS

  kCOLOUR_PICKER_URL: "chrome://bluegriffon/content/colourPicker.xul",

// PUBLIC

  newPersistentColorObject: function(aColorObjectId)
  {
    if (!aColorObjectId)
      return null;

    if (this.mPersistentColorObjects[aColorObjectId])
      return this.mPersistentColorObjects[aColorObjectId];

    var newColorObject = { currentColor: "",
                           lastPickedColor: "",
                           cancelled: false };
    this.mPersistentColorObjects[aColorObjectId] = newColorObject;
    return newColorObject;
  },

  cleanPersistentColorObject: function(aColorObjectId)
  {
    if (!aColorObjectId)
      return;

    if (this.mPersistentColorObjects[aColorObjectId])
      delete this.mPersistentColorObjects[aColorObjectId];
  },

  getCurrentColor: function(aColorObjectId)
  {
    if (!aColorObjectId || !this.mPersistentColorObjects[aColorObjectId])
      return null;
    return this.mPersistentColorObjects[aColorObjectId].currentColor;
  },

  setLastPickedColor: function(aColorObjectId, aColor)
  {
    if (!aColorObjectId || !this.mPersistentColorObjects[aColorObjectId])
      return null;
    this.mPersistentColorObjects[aColorObjectId].lastPickedColor = aColor;
    return aColor;
  },

  isCancelled: function(aColorObjectId)
  {
    if (!aColorObjectId || !this.mPersistentColorObjects[aColorObjectId])
      throw Components.results.NS_ERROR_NULL_POINTER;
    return this.mPersistentColorObjects[aColorObjectId].cancelled;
  },

  openColorPicker: function(aColorObjectId, aWindowTitle, aShowTransparency)
  {
    if (!aColorObjectId)
      return null;

    var colorObject = this.newPersistentColorObject(aColorObjectId);
    this._resetCancelledFlag(colorObject);

    window.openDialog(this.kCOLOUR_PICKER_URL,
                      "_blank",
                      "chrome,close,titlebar,modal",
                      colorObject, aWindowTitle, aShowTransparency);
    return colorObject;
  },

// PRIVATE

  _resetCancelledFlag: function(aColorObject)
  {
    aColorObject.cancelled = false;
  }

};
