      <hbox align="center" class="csspropertiesHeader" context="sectionHeaderContext"
            id="colorsSectionHeader" onclick="ToggleSection(event, this)">
        <image src="chrome://cssproperties/skin/filter.png"/>
        <label value="&colorsSectionHeader.label;"/>
      </hbox>

      <vbox class="section" id="colorsSection">
        <hbox align="center" style="margin-bottom:1em">
          <label value="&color.label;"/>
          <hbox>
            <ecolorpicker id="colorColorpicker"
                          color="black"
                          colorObjectId="ForegroundColor"
                          windowTitle="Foreground color"
                          showTransparency="false"
                          property="color"
                          oncommand="SetColor(this)"/>
          </hbox>
          <label value="&bgColor.label;"/>
          <hbox>
            <ecolorpicker id="bgColorColorpicker"
                          color="transparent"
                          colorObjectId="BackgroundColor"
                          windowTitle="Background color"
                          showTransparency="true"
                          property="background-color"
                          oncommand="SetColor(this)"/>
          </hbox>
        </hbox>
        <grid>
          <columns><column/><column flex="1"/></columns>
          <rows>
            <row align="top">
              <label value="&backgrounds.label;"/>
              <vbox flex="1">
                <richlistbox id="backgroundsRichlistbox" rows="6"
                             onselect="OnBackgroundSelect(this)"/>
                <hbox class="listboxBg">
                  <toolbarbutton id="addBackgroundButton" class="listboxBgPlusButton" type="menu"
                                 oncommand="AddBackground(event)">
                    <menupopup id="addBackgroundMenupopup">
                      <menuitem label="&addBackgroundLinearGradientMenuitem.label;" value="linear-gradient"/>
                      <menuitem label="&addBackgroundRadialGradientMenuitem.label;" value="radial-gradient"/>
                      <menuseparator/>
                      <menuitem label="&addBackgroundImageMenuitem.label;" value="image"/>
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