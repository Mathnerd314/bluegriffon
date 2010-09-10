      <hbox align="center" class="csspropertiesHeader last" context="sectionHeaderContext"
            id="positionSectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this.parentNode)"/>
        <label value="&positionSectionHeader.label;"/>
      </hbox>

      <grid class="section" id="positionSection">
        <columns><column/><column/></columns>
        <rows>
          <row align="center">
            <label value="&float.label;"/>
            <hbox align="center">
              <toolbarbutton class="multibutton" tooltiptext="&leftFloat.label;" value="left" property="float" type="checkbox"
                             image="chrome://cssproperties/skin/position/left-float.png"
                             id="floatLeftButton" group="float"
                             oncommand="ToggleProperty(this)"/>
              <toolbarbutton class="multibutton" tooltiptext="&noneFloat.label;" value="none" property="float" type="checkbox"
                             image="chrome://cssproperties/skin/position/none-float.png"
                             id="floatNoneButton" group="float"
                             oncommand="ToggleProperty(this)"/>
              <toolbarbutton class="multibutton" tooltiptext="&rightFloat.label;" value="right" property="float" type="checkbox"
                             image="chrome://cssproperties/skin/position/right-float.png"
                             id="floatRightButton" group="float"
                             oncommand="ToggleProperty(this)"/>
            </hbox>

          </row>
        </rows>
      </grid>