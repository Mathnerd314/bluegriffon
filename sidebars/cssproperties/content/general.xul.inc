      <hbox align="center" class="csspropertiesHeader" context="sectionHeaderContext"
            id="generalSectionHeader">
        <image src="chrome://cssproperties/skin/filter.png" onclick="ToggleSection(this.parentNode)"/>
        <label value="&generalSectionHeader.label;"/>
      </hbox>

      <vbox class="section" id="generalSection">

        <grid>
          <columns><column/><column/></columns>
          <rows>
            <row align="top">
              <label value="Font family:"/>
              <vbox>
				        <listbox id="fontFamilyListbox"
				                 onselect="OnFontFamilySelect(this)"
				                 rows="6"/>
				
				        <hbox class="listboxBg">
				          <toolbarbutton id="addFontButton" class="listboxBgPlusButton" type="menu"
				                         oncommand="AddFont(event)">
				            <menupopup id="addFontMenupopup">
				              <checkbox id="viewFontsCheckbox" label="View fonts"/>
				              <menuseparator/>
				              <menuitem label="Arial, Helvetica, sans-serif" global="true"
				                        style="font-family: Arial, Helvetica, sans-serif" />
				              <menuitem label="Time New Roman, Time, serif" global="true"
				                        style="font-family: Time New Roman, Time, serif"/>
				              <menuitem label="Courier New, Courier, monospace" global="true"
				                        style="font-family: Courier New, Courier, monospace"/>
				              <menuseparator/>
				            </menupopup>
				          </toolbarbutton>
				          <toolbarbutton id="removeFontButton" class="listboxBgMinusButton"
				                         disabled="true"
				                         oncommand="DeleteFont()"/>
				          
				        </hbox>
              </vbox>
            </row>

            <row align="center">
              <label value="&fontSize.label;"/>
              <hbox align="center">
                <menulist editable="true" id="fontSizeMenulist" property="font-size"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'smaller larger xx-small x-small small medium large x-large xx-large', false)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'smaller larger xx-small x-small small medium large x-large xx-large', false)">
                  <menupopup id="fontSizeMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                    <menuseparator/>
                    <menuitem label="&fontSizeSmaller.label;" value="smaller"/>
                    <menuitem label="&fontSizeLarger.label;"  value="larger"/>
                    <menuseparator/>
                    <menuitem label="&fontSizeXxsmall.label;" value="xx-small"/>
                    <menuitem label="&fontSizeXsmall.label;"  value="x-small"/>
                    <menuitem label="&fontSizeSmall.label;"   value="small"/>
                    <menuitem label="&fontSizeMedium.label;"  value="medium"/>
                    <menuitem label="&fontSizeLarge.label;"   value="large"/>
                    <menuitem label="&fontSizeXlarge.label;"  value="x-large"/>
                    <menuitem label="&fontSizeXxlarge.label;" value="xx-large"/>
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', false)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&lineHeight.label;"/>
              <hbox align="center">
                <menulist editable="true" id="lineHeightMenulist" property="line-height"
                          oncommand="onLengthMenulistCommand(this, ' % px pt cm in mm pc em ex', 'normal', false)"
                          oninput="onLengthMenulistCommand(this, ' % px pt cm in mm pc em ex', 'normal', false)">
                  <menupopup id="lineHeightMenupopup"
                             onpopupshowing="PopulateLengths(this, ' % px pt cm in mm pc em ex')">
                    <menuseparator/>
                    <menuitem label="&lineHeightNormal.label;" value="normal"/>
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, ' % px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, ' % px pt cm in mm pc em ex', false)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&fontWeight.label;"/>
		          <hbox align="center">
		            <toolbarbutton class="multibutton" label="&fontWeightBold.label;" value="bold" property="font-weight" type="checkbox"
		                           style="font-weight:bold" id="fontWeightBoldButton" group="font-weight"
		                           oncommand="ToggleProperty(this)"/>
		            <toolbarbutton class="multibutton" label="&fontWeightLighter.label;" value="lighter" property="font-weight" type="checkbox"
		                           style="font-weight: lighter" id="fontWeightLighterButton" group="font-weight"
		                           oncommand="ToggleProperty(this)"/>
		            <toolbarbutton class="multibutton" label="&fontWeightBolder.label;" value="bolder" property="font-weight" type="checkbox"
		                           style="font-weight: bolder" id="fontWeightBolderButton" group="font-weight"
		                           oncommand="ToggleProperty(this)"/>
		          </hbox>
            </row>

            <row align="center">
              <label value="&fontStyle.label;"/>
              <hbox align="center">
                <toolbarbutton class="multibutton" label="&fontStyleItalic.label;" value="italic" property="font-style" type="checkbox"
                               style="font-style: italic" id="fontStyleItalicButton"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton" label="&fontStyleOblique.label;" value="oblique" property="font-style" type="checkbox"
                               style="font-style: oblique" id="fontStyleObliqueButton"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&textDecoration.label;"/>
			        <hbox align="center">
			          <toolbarbutton class="multibutton" label="&textDecorationUnderline.label;" value="underline" property="text-decoration" type="checkbox"
			                         style="text-decoration: underline" agregator="text-decoration"
                               id="textDecorationUnderlineButton"
                               oncommand="ToggleProperty(this)"/>
			          <toolbarbutton class="multibutton" label="&textDecorationOverline.label;" value="overline" property="text-decoration" type="checkbox"
			                         style="text-decoration: overline" agregator="text-decoration"
                               id="textDecorationOverlineButton"
                               oncommand="ToggleProperty(this)"/>
			          <toolbarbutton class="multibutton" label="&textDecorationLinethrough.label;" value="line-through" property="text-decoration" type="checkbox"
			                         style="text-decoration: line-through" agregator="text-decoration"
                               id="textDecorationLinethroughButton"
                               oncommand="ToggleProperty(this)"/>
			        </hbox>
            </row>

            <row align="center">
              <label value="&textTransform.label;"/>
			        <hbox align="center">
			          <toolbarbutton class="multibutton" label="&textTransformLowercase.label;" value="lowercase" property="text-transform" type="checkbox"
			                         group="text-transform" id="textTransformLowercaseButton"
			                         oncommand="ToggleProperty(this)"/>
			          <toolbarbutton class="multibutton" label="&textTransformUppercase.label;" value="uppercase" property="text-transform" type="checkbox"
			                         group="text-transform" id="textTransformUppercaseButton"
			                         oncommand="ToggleProperty(this)"/>
			          <toolbarbutton class="multibutton" label="&textTransformCapitalize.label;" value="capitalize" property="text-transform" type="checkbox"
			                         group="text-transform" id="textTransformLinethroughButton"
                               oncommand="ToggleProperty(this)"/>
			        </hbox>
            </row>

            <row align="center">
              <label value="&fontVariant.label;"/>
              <hbox align="center">
                <toolbarbutton class="multibutton" label="&fontVariantNormal.label;" value="normal" property="font-variant" type="checkbox"
                               group="font-variant" id="fontVariantNormalButton"
                               oncommand="ToggleProperty(this)"/>
                 <toolbarbutton class="multibutton" label="&fontVariantSmallCaps.label;" value="small-caps" property="font-variant" type="checkbox"
                               group="font-variant" id="fontVariantSmallCapsButton"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&textAlign.label;"/>
              <hbox align="center">
                <toolbarbutton class="multibutton" image="chrome://bluegriffon/skin/formatToolbar/align-left.png"
                               value="left" property="text-align" type="checkbox" group="text-align"
                               id="textAlignLeftButton"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton" image="chrome://bluegriffon/skin/formatToolbar/align-center.png"
                               value="center" property="text-align" type="checkbox" group="text-align"
                               id="textAlignCenterButton"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton" image="chrome://bluegriffon/skin/formatToolbar/align-right.png"
                               value="right" property="text-align" type="checkbox" group="text-align"
                               id="textAlignRightButton"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton" image="chrome://bluegriffon/skin/formatToolbar/align-justify.png"
                               value="justify" property="text-align" type="checkbox" group="text-align"
                               id="textAlignJustifyButton"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>

            <row align="center">
              <spacer flex="1"/>
              <hbox align="center">
                <toolbarbutton class="multibutton" label="&textAlignStart.label;"
                               value="start" property="text-align" type="checkbox" group="text-align"
                               id="textAlignStartButton"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton" label="&textAlignEnd.label;"
                               value="end" property="text-align" type="checkbox" group="text-align"
                               id="textAlignEndButton"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&letterSpacing.label;"/>
              <hbox align="center">
                <menulist editable="true" id="letterSpacingMenulist" property="letter-spacing"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'normal', true)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'normal', true)">
                  <menupopup id="letterSpacingMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                    <menuseparator/>
                    <menuitem label="&normalLetterSpacing.label;" value="normal"/>
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&wordSpacing.label;"/>
              <hbox align="center">
                <menulist editable="true" id="wordSpacingMenulist" property="word-spacing"
                          oncommand="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'normal', true)"
                          oninput="onLengthMenulistCommand(this, '% px pt cm in mm pc em ex', 'normal', true)">
                  <menupopup id="wordSpacingMenupopup"
                             onpopupshowing="PopulateLengths(this, '% px pt cm in mm pc em ex')">
                    <menuseparator/>
                    <menuitem label="&normalWordSpacing.label;" value="normal"/>
                  </menupopup>
                </menulist>
                <spinbuttons onup="IncreaseLength(this, '% px pt cm in mm pc em ex')"
                             ondown="DecreaseLength(this, '% px pt cm in mm pc em ex', true)"/>
              </hbox>
            </row>

            <row align="center">
              <label value="&wordWrap.label;"/>
              <hbox align="center">
                <toolbarbutton class="multibutton" label="&normalWordWrap.label;"
                               value="normal" property="word-wrap" type="checkbox" group="word-wrap"
                               id="normalWordWrapButton"
                               oncommand="ToggleProperty(this)"/>
                <toolbarbutton class="multibutton" label="&breakWordWordWrap.label;"
                               value="end" property="word-wrap" type="checkbox" group="word-wrap"
                               id="breakWrapWordWrapButton"
                               oncommand="ToggleProperty(this)"/>
              </hbox>
            </row>
          </rows>
        </grid>
      </vbox>
