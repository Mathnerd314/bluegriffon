            <iframe id="bespinIframe" src="resource://gre/res/bespin.html" flex="1"
                    onclick="onBespinFocus()"/>
            <hbox id="bespinToolbox" align="center">
              <label value="Line:"/>
              <textbox id="bespinLineTextbox"
                       size="5"
                       onkeypress="onBespinLineKeypress(event, this)"
                       onblur="onBespinLineBlur(this)"/>
              <spacer flex="1"/>
              <label  id="bespinFindPrevious"
                      onclick="onBespinFindPrevious()"
                      hidden="true"
                      value="Previous"/>
              <label  id="bespinFindNext"
                      onclick="onBespinFindNext()"
                      hidden="true"
                      value="Next"/>
              <label value="Find:"/>
              <textbox id="bespinFindTextbox"
                       size="5"
                       type="search"
                       oncommand="onBespinFindClear(event, this)"
                       onkeypress="onBespinFindKeypress(event)"
                       onblur="onBespinFindClear(event, this)"
                       oninput="onBespinFindInput(this)"/>
            </hbox>
