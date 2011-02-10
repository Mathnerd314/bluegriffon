      <hbox align="center" class="csspropertiesHeader" context="sectionHeaderContext"
            id="transformsSectionHeader" onclick="ToggleSection(event, this)">
        <image src="chrome://cssproperties/skin/filter.png"/>
        <label value="&transformsSectionHeader.label;"/>
      </hbox>

      <vbox class="section" id="transformsSection">
        <hbox align="center">
          <label value="&hTransformOrigin.label;"/>
          <menulist id="transformOriginXMenulist" editable="true"
                    oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex rem ch', 'left center right', true, ReapplyTransforms)"
                    oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex rem ch', 'left center right', true, ReapplyTransforms)">
            <menupopup anonid="transformOriginXMenupopup"
                       onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex rem ch')">
              <menuseparator/>
              <menuitem label="&leftTransformOrigin.label;" value="left"/>
              <menuitem label="&centerTransformOrigin.label;" value="center"/>
              <menuitem label="&rightTransformOrigin.label;" value="right"/>
            </menupopup>
          </menulist>
          <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex rem ch', ReapplyTransforms)"
                       ondown="DecreaseLength(this, '% px pt cm in mm pc em ex rem ch', true, ReapplyTransforms)"/>
          <label value="&vTransformOrigin.label;"/>
          <menulist id="transformOriginYMenulist" editable="true"
                    oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex rem ch', 'left center right', true, ReapplyTransforms)"
                    oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex rem ch', 'left center right', true, ReapplyTransforms)">
            <menupopup anonid="transformOriginYMenupopup"
                       onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex rem ch')">
              <menuseparator/>
              <menuitem label="&topTransformOrigin.label;" value="top"/>
              <menuitem label="&centerTransformOrigin.label;" value="center"/>
              <menuitem label="&bottomTransformOrigin.label;" value="bottom"/>
            </menupopup>
          </menulist>
          <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex rem ch', ReapplyTransforms)"
                       ondown="DecreaseLength(this, '% px pt cm in mm pc em ex rem ch', true, ReapplyTransforms)"/>
        </hbox>    
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