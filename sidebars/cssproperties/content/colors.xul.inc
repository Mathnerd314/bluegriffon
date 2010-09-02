      <hbox align="center" class="csspropertiesHeader"
            id="colorsSectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this)"/>
        <label value="&colorsSectionHeader.label;"/>
      </hbox>

      <vbox class="section">
        <grid>
          <columns><column/><column flex="1"/></columns>
          <rows>
            <row align="center" style="margin-bottom: 1em">
              <label value="&color.label;"/>
              <hbox>
					      <ecolorpicker id="colorColorpicker"
					                    color="transparent"
					                    colorObjectId="ForegroundColor"
					                    windowTitle="Foreground color"
					                    showTransparency="false"
                              oncommand="SetColor(this)"/>
              </hbox>
            </row>
            <row align="top">
              <label value="&backgrounds.label;"/>
              <vbox flex="1">
	              <richlistbox id="backgroundsRichlistbox" rows="6"
                             onselect="OnBackgroundSelect(this)"/>
	              <hbox class="listboxBg">
	                <toolbarbutton id="addBackgroundButton" class="listboxBgPlusButton" type="menu"
	                               oncommand="AddBackground(event)">
	                  <menupopup id="addBackgroundMenupopup" onpopupshowing="UpdateAddBackgroundMenupopup(this)">
                      <menuitem label="&addBackgroundColorMenuitem.label;" value="color"/>
                      <menuitem label="&addBackgroundLinearGradientMenuitem.label;" value="linear-gradient"/>
                      <menuitem label="&addBackgroundRadialGradientMenuitem.label;" value="radial-gradient"/>
                      <menuseparator/>
                      <menuitem label="&addBackgroundImageMenuitem.label;" value="url"/>
	                  </menupopup>
	                </toolbarbutton>
	                <toolbarbutton id="removeBackgroundButton" class="listboxBgMinusButton"
	                               disabled="true"
	                               oncommand="DeleteBackground()"/>
	                
	              </hbox>
              </vbox>
            </row>
          </rows>
        </grid>
      </vbox>