      <hbox align="center" class="csspropertiesHeader" context="sectionHeaderContext"
            id="shadowsSectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this.parentNode)"/>
        <label value="&shadowsSectionHeader.label;"/>
      </hbox>

      <vbox class="section" id="shadowsSection">
          <richlistbox id="textShadowRichlistbox" rows="6"
                       onselect="OnTextShadowSelect(this)"/>
          <hbox class="listboxBg">
            <toolbarbutton id="addTextShadowButton" class="listboxBgPlusButton" type="menu"
                           oncommand="AddTextShadow(event)">
              <menupopup id="addTextShadowMenupopup">
                <menuitem label="&noneTextShadow.label;" value="none" id="noneTextShadowMenuitem"/>
                <menuseparator/>
                <menuitem label="&oneShadow.label;" value="shadow" id="shadowTextShadowMenuitem"/>
              </menupopup>
            </toolbarbutton>
            <toolbarbutton id="removeTextShadowButton" class="listboxBgMinusButton"
                           disabled="true"
                           oncommand="DeleteTextShadow()"/>
            
          </hbox>
      </vbox>
