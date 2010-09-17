      <hbox align="center" class="csspropertiesHeader" context="sectionHeaderContext"
            id="transformsSectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this.parentNode)"/>
        <label value="&transformsSectionHeader.label;"/>
      </hbox>

      <vbox class="section" id="transformsSection">
	        <richlistbox id="transformsRichlistbox" rows="6"
	                     onselect="OnTransformSelect(this)"/>
	        <hbox class="listboxBg">
	          <toolbarbutton id="addTransformButton" class="listboxBgPlusButton" type="menu"
	                         oncommand="AddTransform(event)">
	            <menupopup id="addBackgroundMenupopup">
	              <menuitem label="&addBackgroundLinearGradientMenuitem.label;" value="linear-gradient"/>
	              <menuitem label="&addBackgroundRadialGradientMenuitem.label;" value="radial-gradient"/>
	              <menuseparator/>
	              <menuitem label="&addBackgroundImageMenuitem.label;" value="image"/>
	            </menupopup>
	          </toolbarbutton>
	          <toolbarbutton id="removeTransformButton" class="listboxBgMinusButton"
	                         disabled="true"
	                         oncommand="DeleteTransform()"/>
	          
	        </hbox>
      </vbox>