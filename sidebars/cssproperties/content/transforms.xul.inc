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
	            <menupopup id="addTransformMenupopup">
	              <menuitem label="&rotation.label;"    value="rotate"/>
	              <menuitem label="&translation.label;" value="translate"/>
                <menuitem label="&skew.label;"        value="skew"/>
                <menuitem label="&scale.label;"       value="scale"/>
	            </menupopup>
	          </toolbarbutton>
	          <toolbarbutton id="removeTransformButton" class="listboxBgMinusButton"
	                         disabled="true"
	                         oncommand="DeleteTransform()"/>
	          
	        </hbox>
      </vbox>