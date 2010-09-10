      <hbox align="center" class="csspropertiesHeader" context="sectionHeaderContext"
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

          <row align="center">
            <label value="&clear.label;"/>
            <hbox>
	            <hbox align="center">
	              <toolbarbutton class="multibutton" label="&leftClear.label;" value="left" property="clear" type="checkbox"
	                             id="clearLeftButton" group="clear"
	                             oncommand="ToggleProperty(this)"/>
	              <toolbarbutton class="multibutton" label="&rightClear.label;" value="right" property="clear" type="checkbox"
	                             id="clearRightButton" group="clear"
	                             oncommand="ToggleProperty(this)"/>
	            </hbox>
	            <hbox align="center">
	              <toolbarbutton class="multibutton" label="&bothClear.label;" value="both" property="clear" type="checkbox"
	                             id="clearBothButton" group="clear"
	                             oncommand="ToggleProperty(this)"/>
	            </hbox>
	            <hbox align="center">
	              <toolbarbutton class="multibutton" label="&noneClear.label;" value="none" property="clear" type="checkbox"
	                             id="clearNoneButton" group="clear"
	                             oncommand="ToggleProperty(this)"/>
	            </hbox>
            </hbox>
          </row>

          <row align="center">
            <label value="&position.label;"/>
            <hbox align="center">
              <toolbarbutton class="multibutton" label="&staticPosition.label;" value="static" property="position" type="checkbox"
                             id="positionStaticButton" group="position"
                             oncommand="ToggleProperty(this)"/>
              <toolbarbutton class="multibutton" label="&relativePosition.label;" value="relative" property="position" type="checkbox"
                             id="positionRelativeButton" group="position"
                             oncommand="ToggleProperty(this)"/>
              <toolbarbutton class="multibutton" label="&absolutePosition.label;" value="absolute" property="position" type="checkbox"
                             id="positionAbsoluteButton" group="position"
                             oncommand="ToggleProperty(this)"/>
              <toolbarbutton class="multibutton" label="&fixedPosition.label;" value="fixed" property="position" type="checkbox"
                             id="positionFixedButton" group="position"
                             oncommand="ToggleProperty(this)"/>
            </hbox>
          </row>

          <row align="center">
            <label value="&zIndex.label;"/>
            <hbox align="center">
                <menulist editable="true" id="zIndexMenulist" property="z-index"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', true)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', true)">
                  <menupopup id="lineHeightMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                    <menuseparator/>
                    <menuitem label="&zIndexAuto.label;" value="auto"/>
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
            </hbox>
          </row>

          <row align="top">
            <label value="&offsets.label;"/>
            <grid style="background-color: #e0e0e0">
              <columns><column/><column/><column/></columns>
              <rows>
                <row>
                  <spacer/>
                  <menulist editable="true" id="topMenulist" property="top"
                            oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', true)"
                            oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', true)">
                    <menupopup id="topMenupopup"
                               onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                      <menuseparator/>
                      <menuitem label="&offsetAuto.label;" value="auto"/>
                    </menupopup>
                  </menulist>
                  <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                               ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
                 </row>

                <row align="center">
                  <hbox align="center">
	                  <menulist editable="true" id="leftMenulist" property="left"
	                            oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', true)"
	                            oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', true)">
	                    <menupopup id="leftMenupopup"
	                               onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
	                      <menuseparator/>
	                      <menuitem label="&offsetAuto.label;" value="auto"/>
	                    </menupopup>
	                  </menulist>
	                  <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
	                               ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
                  </hbox>
                  <spacer/>
                  <hbox align="center">
                    <menulist editable="true" id="rightMenulist" property="right"
                              oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', true)"
                              oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', true)">
                      <menupopup id="rightMenupopup"
                                 onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                        <menuseparator/>
                        <menuitem label="&offsetAuto.label;" value="auto"/>
                      </menupopup>
                    </menulist>
                    <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                                 ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
                  </hbox>
                </row>

                <row>
                  <spacer/>
                  <menulist editable="true" id="bottomMenulist" property="bottom"
                            oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', true)"
                            oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', true)">
                    <menupopup id="bottomMenupopup"
                               onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                      <menuseparator/>
                      <menuitem label="&offsetAuto.label;" value="auto"/>
                    </menupopup>
                  </menulist>
                  <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                               ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
                 </row>
              </rows>
            </grid>
          </row>
        </rows>
      </grid>
