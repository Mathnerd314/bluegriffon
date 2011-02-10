      <hbox align="center" class="csspropertiesHeader" context="sectionHeaderContext"
            id="transitionsSectionHeader" onclick="ToggleSection(event, this)">
        <image src="chrome://cssproperties/skin/filter.png"/>
        <label value="&transitionsSectionHeader.label;"/>
      </hbox>

      <vbox class="section" id="transitionsSection">
          <richlistbox id="transitionsRichlistbox" rows="6"
                       onselect="OnTransitionSelect(this)"/>
          <hbox class="listboxBg">
            <toolbarbutton id="addTransitionButton" class="listboxBgPlusButton" type="menu"
                           oncommand="AddTransition(event)">
              <menupopup id="addTransitionMenupopup">
                <menuitem label="&propertyTransition.label;"  value="property"
                          id="onePropertyTransitionMenuitem"/>
                <menuseparator/>
                <menuitem label="&noneTransition.label;"    value="none"
                          id="noneTransitionMenuitem"/>
                <menuseparator/>
                <menuitem label="&allTransition.label;"     value="all"
                          id="allTransitionMenuitem"/>
              </menupopup>
            </toolbarbutton>
            <toolbarbutton id="removeTransitionButton" class="listboxBgMinusButton"
                           disabled="true"
                           oncommand="DeleteTransition()"/>
            
          </hbox>
      </vbox>
