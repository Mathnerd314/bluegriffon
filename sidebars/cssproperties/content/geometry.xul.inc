      <hbox align="center" class="csspropertiesHeader" context="sectionHeaderContext"
            id="geometrySectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this.parentNode)"/>
        <label value="&geometrySectionHeader.label;"/>
      </hbox>

      
      <vbox class="section" id="geometrySection">

        <grid>
          <columns><column/><column/><column/><column/><column/></columns>
          <rows>
            <row align="center">
              <label value="&width.label;"/>
              <menulist sizetopopup="none" editable="true" id="widthMenulist" property="width"
                        checkimageratio="true"
                        oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false);"
                        oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false)">
                <menupopup id="widthMenupopup"
                           onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  <menuseparator/>
                  <menuitem label="&autoWidth.label;" value="auto"/>
                </menupopup>
              </menulist>
              <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                           ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
              <spacer flex="1"/>
              <checkbox label="&preserveImageRatio.label;"
                        id="preserveImageRatioCheckbox"/>
            </row>

            <row align="center">
              <label value="&height.label;"/>
              <menulist sizetopopup="none" editable="true" id="heightMenulist" property="height"
                        checkimageratio="true"
                        oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false)"
                        oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false)">
                <menupopup id="heightMenupopup"
                           onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  <menuseparator/>
                  <menuitem label="&autoHeight.label;" value="auto"/>
                </menupopup>
              </menulist>
              <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                           ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
              <spacer flex="1"/>
              <button label="&getNaturalSize.label;" id="getNaturalSizeButton"
                      oncommand="GetNaturalSize()"/>
            </row>

            <row align="center">
              <label value="&minWidth.label;"/>
              <menulist sizetopopup="none" editable="true" id="minWidthMenulist" property="min-width"
                        oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'none', false)"
                        oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'none', false)">
                <menupopup id="minWidthMenupopup"
                           onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                </menupopup>
              </menulist>
              <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                           ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
                <label value="&maxWidth.label;"/>
                <hbox align="center">
                  <menulist sizetopopup="none" editable="true" id="maxWidthMenulist" property="max-width"
                            oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'none', false)"
                            oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'none', false)">
                    <menupopup id="maxWidthMenupopup"
                               onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                      <menuseparator/>
                      <menuitem label="&noneMaxWidth.label;" value="none"/>
                    </menupopup>
                  </menulist>
                  <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                               ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
                </hbox>
            </row>

            <row align="center">
              <label value="&minHeight.label;"/>
              <menulist sizetopopup="none" editable="true" id="minHeightMenulist" property="min-height"
                        oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'none', false)"
                        oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'none', false)">
                <menupopup id="minHeightMenupopup"
                           onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                </menupopup>
              </menulist>
              <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                           ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
                <label value="&maxHeight.label;"/>
                <hbox align="center">
                  <menulist sizetopopup="none" editable="true" id="maxHeightMenulist" property="max-height"
                            oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'none', false)"
                            oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'none', false)">
                    <menupopup id="maxHeightMenupopup"
                               onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                      <menuseparator/>
                      <menuitem label="&noneMaxHeight.label;" value="none"/>
                    </menupopup>
                  </menulist>
                  <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                               ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
                </hbox>
            </row>

          </rows>
        </grid>

        <vbox id="geometry-margin-box">

          <hbox align="center">
            <label value="&margins.label;"/>
            <spacer flex="1"/>
            <menulist sizetopopup="none" editable="true" id="marginTopMenulist" property="margin-top"
                      oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false)"
                      oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false)">
              <menupopup id="marginTopMenupopup"
                         onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                <menuseparator/>
                <menuitem label="&autoMargin.label;" value="auto"/>
              </menupopup>
            </menulist>
            <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                         ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
            <spacer flex="1"/>
            <label value="&margins.label;" style="visibility: hidden"/>
          </hbox>

          <hbox align="center">
            <menulist sizetopopup="none" editable="true" id="marginLeftMenulist" property="margin-left"
                      oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false)"
                      oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false)">
              <menupopup id="marginLeftMenupopup"
                         onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                <menuseparator/>
                <menuitem label="&autoMargin.label;" value="auto"/>
              </menupopup>
            </menulist>
            <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                         ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
            <vbox flex="1" id="geometry-padding-box">
              <hbox align="center">
                <label value="&paddings.label;"/>
                <spacer flex="1"/>
                <menulist sizetopopup="none" editable="true" id="paddingTopMenulist" property="padding-top"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', false)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', false)">
                  <menupopup id="paddingTopMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
                <spacer flex="1"/>
                <label value="&paddings.label;" style="visibility: hidden"/>
              </hbox>
              <hbox align="center">
                <menulist sizetopopup="none" editable="true" id="paddingLeftMenulist" property="padding-left"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', false)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', false)">
                  <menupopup id="paddingLeftMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
                <vbox id="geometry-content-box" flex="1" align="center">
                  <spacer flex="1"/>
                  <label value="&contentArea.label;"/>
                  <spacer flex="1"/>
                </vbox>
                <menulist sizetopopup="none" editable="true" id="paddingRightMenulist" property="padding-right"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', false)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', false)">
                  <menupopup id="paddingRightMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
              </hbox>
              <hbox align="center">
                <spacer flex="1"/>
                    <menulist sizetopopup="none" editable="true" id="paddingBottomMenulist" property="padding-bottom"
                              fouredges="padding-top,padding-left,padding-right"
                              fouredgescontrol="useSameFourPaddingsCheckbox"
                              oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', false)"
                              oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', '', false)">
                      <menupopup id="paddingBottomMenupopup"
                                 onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                      </menupopup>
                    </menulist>
                    <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                                 ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
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
                      oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false)"
                      oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false)">
              <menupopup id="marginRightMenupopup"
                         onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                <menuseparator/>
                <menuitem label="&autoMargin.label;" value="auto"/>
              </menupopup>
            </menulist>
            <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                         ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
          </hbox>

          <hbox align="center">
            <spacer flex="1"/>
            <menulist sizetopopup="none" editable="true" id="marginBottomMenulist" property="margin-bottom"
                      fouredges="margin-top,margin-left,margin-right"
                      fouredgescontrol="useSameFourMarginsCheckbox"
                      oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false)"
                      oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'auto', false)">
              <menupopup id="marginBottomMenupopup"
                         onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                <menuseparator/>
                <menuitem label="&autoMargin.label;" value="auto"/>
              </menupopup>
            </menulist>
            <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                         ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
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