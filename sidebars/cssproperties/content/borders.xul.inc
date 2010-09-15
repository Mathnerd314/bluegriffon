      <hbox align="center" class="csspropertiesHeader" context="sectionHeaderContext"
            id="bordersSectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this.parentNode)"/>
        <label value="&bordersSectionHeader.label;"/>
      </hbox>

      <vbox class="section" id="bordersSection">
        <checkbox label="&sameBorderOnFourEdges.label;"
                  id="sameBorderOnFourEdgesCheckbox"
                  oncommand="ToggleSameBorderOnFourEdges(this)"/>
        <grid>
          <columns><column/><column/><column style="margin-right: 1em"/><column/></columns>
          <rows>
            <row align="center">
              <label value="&topBorder.label;"/>
              <ecolorpicker id="borderTopColorpicker"
                            color="black"
                            colorObjectId="BorderColor"
                            windowTitle="Border color"
                            showTransparency="true"
                            property="border-top-color"
                            oncommand="SetColor(this)"/>
              <hbox align="center">
                <menulist editable="true" id="borderTopWidthMenulist" property="border-top-width"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false)">
                  <menupopup id="borderTopWidthMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                    <menuseparator/>
                    <menuitem label="&thinBorderWidth.label;" value="thin"/>
                    <menuitem label="&mediumBorderWidth.label;" value="medium"/>
                    <menuitem label="&thickBorderWidth.label;" value="thick"/>
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
              </hbox>
              <menulist id="borderTopStyleMenulist" property="border-top-style"
                        oncommand="ApplyPropertyFromMenulist(this)">
                <menupopup>
                  <menuitem label="&noneBorderStyleStyle.label;" value="none"/>
                  <menuitem label="&hiddenBorderStyleStyle.label;" value="hidden"/>
                  <menuseparator/>
                  <menuitem label="&solidBorderStyleStyle.label;" value="solid"/>
                  <menuitem label="&doubleBorderStyleStyle.label;" value="double"/>
                  <menuitem label="&dottedBorderStyleStyle.label;" value="dotted"/>
                  <menuitem label="&dashedBorderStyleStyle.label;" value="dashed"/>
                  <menuitem label="&grooveBorderStyleStyle.label;" value="groove"/>
                  <menuitem label="&ridgeBorderStyleStyle.label;" value="ridge"/>
                  <menuitem label="&insetBorderStyleStyle.label;" value="inset"/>
                  <menuitem label="&outsetBorderStyleStyle.label;" value="outset"/>
                </menupopup>
              </menulist>
            </row>

            <row align="center">
              <label value="&leftBorder.label;"/>
              <ecolorpicker id="borderLeftColorpicker"
                            color="black"
                            colorObjectId="BorderColor"
                            windowTitle="Border color"
                            showTransparency="true"
                            property="border-left-color"
                            oncommand="SetColor(this)"/>
              <hbox align="center">
                <menulist editable="true" id="borderLeftWidthMenulist" property="border-left-width"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false)">
                  <menupopup id="borderLeftWidthMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                    <menuseparator/>
                    <menuitem label="&thinBorderWidth.label;" value="thin"/>
                    <menuitem label="&mediumBorderWidth.label;" value="medium"/>
                    <menuitem label="&thickBorderWidth.label;" value="thick"/>
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
              </hbox>
              <menulist id="borderLeftStyleMenulist" property="border-left-style"
                        oncommand="ApplyPropertyFromMenulist(this)">
                <menupopup>
                  <menuitem label="&noneBorderStyleStyle.label;" value="none"/>
                  <menuitem label="&hiddenBorderStyleStyle.label;" value="hidden"/>
                  <menuseparator/>
                  <menuitem label="&solidBorderStyleStyle.label;" value="solid"/>
                  <menuitem label="&doubleBorderStyleStyle.label;" value="double"/>
                  <menuitem label="&dottedBorderStyleStyle.label;" value="dotted"/>
                  <menuitem label="&dashedBorderStyleStyle.label;" value="dashed"/>
                  <menuitem label="&grooveBorderStyleStyle.label;" value="groove"/>
                  <menuitem label="&ridgeBorderStyleStyle.label;" value="ridge"/>
                  <menuitem label="&insetBorderStyleStyle.label;" value="inset"/>
                  <menuitem label="&outsetBorderStyleStyle.label;" value="outset"/>
                </menupopup>
              </menulist>
            </row>

            <row align="center">
              <label value="&rightBorder.label;"/>
              <ecolorpicker id="borderRightColorpicker"
                            color="black"
                            colorObjectId="BorderColor"
                            windowTitle="Border color"
                            showTransparency="true"
                            property="border-right-color"
                            oncommand="SetColor(this)"/>
              <hbox align="center">
                <menulist editable="true" id="borderRightWidthMenulist" property="border-right-width"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false)">
                  <menupopup id="borderRightWidthMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                    <menuseparator/>
                    <menuitem label="&thinBorderWidth.label;" value="thin"/>
                    <menuitem label="&mediumBorderWidth.label;" value="medium"/>
                    <menuitem label="&thickBorderWidth.label;" value="thick"/>
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
              </hbox>
              <menulist id="borderRightStyleMenulist" property="border-right-style"
                        oncommand="ApplyPropertyFromMenulist(this)">
                <menupopup>
                  <menuitem label="&noneBorderStyleStyle.label;" value="none"/>
                  <menuitem label="&hiddenBorderStyleStyle.label;" value="hidden"/>
                  <menuseparator/>
                  <menuitem label="&solidBorderStyleStyle.label;" value="solid"/>
                  <menuitem label="&doubleBorderStyleStyle.label;" value="double"/>
                  <menuitem label="&dottedBorderStyleStyle.label;" value="dotted"/>
                  <menuitem label="&dashedBorderStyleStyle.label;" value="dashed"/>
                  <menuitem label="&grooveBorderStyleStyle.label;" value="groove"/>
                  <menuitem label="&ridgeBorderStyleStyle.label;" value="ridge"/>
                  <menuitem label="&insetBorderStyleStyle.label;" value="inset"/>
                  <menuitem label="&outsetBorderStyleStyle.label;" value="outset"/>
                </menupopup>
              </menulist>
            </row>

            <row align="center">
              <label value="&bottomBorder.label;" id="borderBottomLabel"/>
              <ecolorpicker id="borderBottomColorpicker"
                            color="black"
                            colorObjectId="BorderColor"
                            windowTitle="Border color"
                            showTransparency="true"
                            property="border-bottom-color"
                            fouredges="border-top-color,border-right-color,border-left-color"
                            fouredgescontrol="sameBorderOnFourEdgesCheckbox"
                            oncommand="SetColor(this)"/>
              <hbox align="center">
                <menulist editable="true" id="borderBottomWidthMenulist" property="border-bottom-width"
                          fouredges="border-top-width,border-right-width,border-left-width"
                          fouredgescontrol="sameBorderOnFourEdgesCheckbox"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false)">
                  <menupopup id="borderBottomWidthMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                    <menuseparator/>
                    <menuitem label="&thinBorderWidth.label;" value="thin"/>
                    <menuitem label="&mediumBorderWidth.label;" value="medium"/>
                    <menuitem label="&thickBorderWidth.label;" value="thick"/>
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
              </hbox>
              <menulist id="borderBottomStyleMenulist" property="border-bottom-style"
                        fouredgescontrol="sameBorderOnFourEdgesCheckbox"
                        fouredges="border-top-style,border-right-style,border-left-style"
                        oncommand="ApplyPropertyFromMenulist(this)">
                <menupopup>
                  <menuitem label="&noneBorderStyleStyle.label;" value="none"/>
                  <menuitem label="&hiddenBorderStyleStyle.label;" value="hidden"/>
                  <menuseparator/>
                  <menuitem label="&solidBorderStyleStyle.label;" value="solid"/>
                  <menuitem label="&doubleBorderStyleStyle.label;" value="double"/>
                  <menuitem label="&dottedBorderStyleStyle.label;" value="dotted"/>
                  <menuitem label="&dashedBorderStyleStyle.label;" value="dashed"/>
                  <menuitem label="&grooveBorderStyleStyle.label;" value="groove"/>
                  <menuitem label="&ridgeBorderStyleStyle.label;" value="ridge"/>
                  <menuitem label="&insetBorderStyleStyle.label;" value="inset"/>
                  <menuitem label="&outsetBorderStyleStyle.label;" value="outset"/>
                </menupopup>
              </menulist>
            </row>
          </rows>
        </grid>

        <checkbox label="&sameFourCorners.label;" id="sameFourCornersCheckbox"
                  oncommand="ToggleSameFourCorners(this)"/>
        <grid>
          <columns><column/><column/><column/></columns>
          <rows>
            <row align="center">
              <label value="&topLeftCorner.label;"/>
              <hbox align="center">
                <menulist editable="true" id="topLeftBorderRadiusXMenulist"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)">
                  <menupopup id="topLeftBorderRadiusXMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex', ApplyBorderRadius)"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false, ApplyBorderRadius)"/>
              </hbox>
              <hbox align="center">
                <menulist editable="true" id="topLeftBorderRadiusYMenulist"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)">
                  <menupopup id="topLeftBorderRadiusYMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex', ApplyBorderRadius)"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false, ApplyBorderRadius)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&topRightCorner.label;"/>
              <hbox align="center">
                <menulist editable="true" id="topRightBorderRadiusXMenulist"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)">
                  <menupopup id="topRightBorderRadiusXMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex', ApplyBorderRadius)"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false, ApplyBorderRadius)"/>
              </hbox>
              <hbox align="center">
                <menulist editable="true" id="topRightBorderRadiusYMenulist"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)">
                  <menupopup id="topRightBorderRadiusYMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex', ApplyBorderRadius)"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false, ApplyBorderRadius)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&bottomLeftCorner.label;"/>
              <hbox align="center">
                <menulist editable="true" id="bottomLeftBorderRadiusXMenulist"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)">
                  <menupopup id="bottomLeftBorderRadiusXMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex', ApplyBorderRadius)"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false, ApplyBorderRadius)"/>
              </hbox>
              <hbox align="center">
                <menulist editable="true" id="bottomLeftBorderRadiusYMenulist"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)">
                  <menupopup id="bottomLeftBorderRadiusYMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex', ApplyBorderRadius)"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false, ApplyBorderRadius)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&bottomRightCorner.label;" id="bottomRightCornerLabel"/>
              <hbox align="center">
                <menulist editable="true" id="bottomRightBorderRadiusXMenulist"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)">
                  <menupopup id="bottomRightBorderRadiusXMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex', ApplyBorderRadius)"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false, ApplyBorderRadius)"/>
              </hbox>
              <hbox align="center">
                <menulist editable="true" id="bottomRightBorderRadiusYMenulist"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'thin medium thick', false, ApplyBorderRadius)">
                  <menupopup id="bottomRightBorderRadiusYMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex', ApplyBorderRadius)"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false, ApplyBorderRadius)"/>
              </hbox>
            </row>

          </rows>
        </grid>

        <checkbox label="&useImageAsBorder.label;" id="useImageAsBorderCheckbox"
                  oncommand="ToggleImageAsBorder(this)"/>
        <vbox class="indent" id="useImageAsBorderVbox">
          <label value="&enterImageUrl.label;"/>
		      <hbox align="center">
		        <textbox flex="1" id="borderImageURLTextbox"
		                 oninput="LoadBorderImage()"/>
		        <filepickerbutton id="borderImageURLFilepicker"
		                          control="borderImageURLTextbox"
		                          mode="0"
		                          filters="filterImages"
		                          oncommand="LoadBorderImage();MakeRelativeUrl();"
		                          title="&borderImageURLButton.label;"/>
          </hbox>
          <hbox align="center" id="borderImagePreviewBox" hidden="true">
            <vbox align="center">
              <label value="From left edge:"/>
              <textbox type="number" size="5" id="leftEdgeSlicingTextbox"/>
            </vbox>
            <vbox align="center">
              <hbox align="center">
	              <label value="From top edge:"/>
	              <textbox type="number" size="5" id="topEdgeSlicingTextbox"/>
              </hbox>
	            <stack>
	              <image id="borderImagePreview" top="0" left="0" style="margin: 15px"
	                     onload="SizeBorderImageRulers(this)"
	                     onerror="ErrorLoadingBorderImage()"/>

	              <box id="borderImageFromTop" top="15" left="0"
                     onmousedown="StartMovingBorderImageSliceEdge(event, this, 'top')"
                     onmousemove="MoveBorderImageSliceEdge(event, this, 'top')"
                     onmouseup="StopMovingBorderImageSliceEdge(event, this, 'top')"/>
	              <box id="borderImageFromRight" right="15" top="0"
                     onmousedown="StartMovingBorderImageSliceEdge(event, this, 'right')"
                     onmousemove="MoveBorderImageSliceEdge(event, this, 'right')"
                     onmouseup="StopMovingBorderImageSliceEdge(event, this, 'right')"/>
	              <box id="borderImageFromLeft" left="15" top="0"
                     onmousedown="StartMovingBorderImageSliceEdge(event, this, 'left')"
                     onmousemove="MoveBorderImageSliceEdge(event, this, 'left')"
                     onmouseup="StopMovingBorderImageSliceEdge(event, this, 'left')"/>
	              <box id="borderImageFromBottom" bottom="15" left="0"
                     onmousedown="StartMovingBorderImageSliceEdge(event, this, 'bottom')"
                     onmousemove="MoveBorderImageSliceEdge(event, this, 'bottom')"
                     onmouseup="StopMovingBorderImageSliceEdge(event, this, 'bottom')"/>
	            </stack>
              <hbox align="center">
                <label value="From bottom edge:"/>
                <textbox type="number" size="5" id="bottomEdgeSlicingTextbox"/>
              </hbox>
            </vbox>
            <vbox align="center">
              <label value="From right edge:"/>
              <textbox type="number" size="5" id="rightEdgeSlicingTextbox"/>
            </vbox>
          </hbox>
        </vbox>
      </vbox>

