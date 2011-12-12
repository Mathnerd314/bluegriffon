      <hbox align="center" class="csspropertiesHeader" context="sectionHeaderContext"
            id="shadowsSectionHeader" onclick="ToggleSection(event, this)">
        <image />
        <label value="&shadowsSectionHeader.label;"/>
      </hbox>

      <vbox class="section" id="shadowsSection">
        <vbox animatable="true">
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
            <label value="&textShadows.label;"/>
            
          </hbox>
        </vbox>

        <vbox id="boxShadowVbox" animatable="true">
          <richlistbox id="boxShadowRichlistbox" rows="6"
                       onselect="OnBoxShadowSelect(this)"/>
          <hbox class="listboxBg">
            <toolbarbutton id="addBoxShadowButton" class="listboxBgPlusButton" type="menu"
                           oncommand="AddBoxShadow(event)">
              <menupopup id="addBoxShadowMenupopup">
                <menuitem label="&noneTextShadow.label;" value="none" id="noneBoxShadowMenuitem"/>
                <menuseparator/>
                <menuitem label="&oneShadow.label;" value="shadow" id="shadowBoxShadowMenuitem"/>
              </menupopup>
            </toolbarbutton>
            <toolbarbutton id="removeBoxShadowButton" class="listboxBgMinusButton"
                           disabled="true"
                           oncommand="DeleteBoxShadow()"/>
            <label value="&boxShadows.label;"/>
            
          </hbox>
        </vbox>
      </vbox>
