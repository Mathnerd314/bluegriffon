      <hbox align="center" class="csspropertiesHeader"
            id="geometrySectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this)"/>
        <label value="&geometrySectionHeader.label;"/>
      </hbox>

      
      <vbox class="section" id="geometrySection">
        <vbox id="geometry-margin-box">

          <hbox align="center">
            <label value="&margins.label;"/>
            <spacer flex="1"/>
            <menulist sizetopopup="none" editable="true" id="marginTopMenulist" property="margin-top"
                      oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)"
                      oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)">
              <menupopup id="marginTopMenupopup"
                         onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
              </menupopup>
            </menulist>
            <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                         ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
            <spacer flex="1"/>
            <label value="&margins.label;" style="visibility: hidden"/>
          </hbox>

          <hbox align="center">
            <menulist sizetopopup="none" editable="true" id="marginLeftMenulist" property="margin-left"
                      oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)"
                      oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)">
              <menupopup id="marginLeftMenupopup"
                         onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
              </menupopup>
            </menulist>
            <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                         ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
            <vbox flex="1" id="geometry-padding-box">
              <hbox align="center">
                <label value="&paddings.label;"/>
                <spacer flex="1"/>
		            <menulist sizetopopup="none" editable="true" id="paddingTopMenulist" property="padding-top"
		                      oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)"
		                      oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)">
		              <menupopup id="paddingTopMenupopup"
		                         onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
		              </menupopup>
		            </menulist>
		            <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
		                         ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
                <spacer flex="1"/>
                <label value="&paddings.label;" style="visibility: hidden"/>
              </hbox>
              <hbox align="center">
                <menulist sizetopopup="none" editable="true" id="paddingLeftMenulist" property="padding-left"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)">
                  <menupopup id="paddingLeftMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
                <vbox id="geometry-content-box" flex="1" align="center">
                  <spacer flex="1"/>
                  <label value="&contentArea.label;"/>
                  <spacer flex="1"/>
                </vbox>
                <menulist sizetopopup="none" editable="true" id="paddingRightMenulist" property="padding-right"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)">
                  <menupopup id="paddingRightMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
              </hbox>
		          <hbox align="center">
		            <spacer flex="1"/>
		                <menulist sizetopopup="none" editable="true" id="paddingBottomMenulist" property="padding-bottom"
                              fouredges="padding-top,padding-left,padding-right"
		                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)"
		                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)">
		                  <menupopup id="paddingBottomMenupopup"
		                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
		                  </menupopup>
		                </menulist>
		                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
		                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
		            <spacer flex="1"/>
		          </hbox>
              <hbox align="center">
                <spacer flex="1"/>
                <checkbox label="&useSameFourPaddings.label;" id="useSameFourPaddingsCheckbox"
                      oncommand="ToggleFourEdges(this, 'padding')"/>
                <spacer flex="1"/>
              </hbox>
            </vbox>
            <menulist sizetopopup="none" editable="true" id="marginRightMenulist" property="margin-right"
                      oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)"
                      oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)">
              <menupopup id="marginRightMenupopup"
                         onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
              </menupopup>
            </menulist>
            <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                         ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
          </hbox>

          <hbox align="center">
            <spacer flex="1"/>
            <menulist sizetopopup="none" editable="true" id="marginBottomMenulist" property="margin-bottom"
                      fouredges="margin-top,margin-left,margin-right"
                      oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)"
                      oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', true)">
              <menupopup id="marginBottomMenupopup"
                         onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
              </menupopup>
            </menulist>
            <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                         ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
            <spacer flex="1"/>
          </hbox>
          <hbox align="center">
            <spacer flex="1"/>
            <checkbox label="&useSameFourMargins.label;" id="useSameFourMarginsCheckbox"
                      oncommand="ToggleFourEdges(this, 'margin')"/>
            <spacer flex="1"/>
          </hbox>

        </vbox>
      </vbox>