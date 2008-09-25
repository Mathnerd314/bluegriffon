/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Diavolo.
 *
 * The Initial Developer of the Original Code is
 * Disruptive Innovations SARL.
 * Portions created by the Initial Developer are Copyright (C) 2006-2008
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Daniel Glazman <daniel.glazman@disruptive-innovations.com>, Original author
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

function DiavoloGrammar(aChromeURL)
{
  this.init(aChromeURL);
}

DiavoloGrammar.prototype = {
  
  kIOServiceCID      : "@mozilla.org/network/io-service;1",
  kFileInputStreamCID: "@mozilla.org/network/file-input-stream;1",
  kScriptableInputCID: "@mozilla.org/scriptableinputstream;1",
  kUnicodeConverterCID: "@mozilla.org/intl/scriptableunicodeconverter",

  nsIIOService            : Components.interfaces.nsIIOService,
  nsIFileInputStream      : Components.interfaces.nsIFileInputStream,
  nsIScriptableInputStream: Components.interfaces.nsIScriptableInputStream,
  nsIScriptableUnicodeConverter: Components.interfaces.nsIScriptableUnicodeConverter,

  kSTRING_TOKEN: 0,
  kREGEXP_TOKEN: 1,

  mChromeURL: "",
  mName: "",

  mGrammarDocument: null,

  mContexts: {},
  mRegExps: {},
  mDeftokens: {},
  mRoles: {},
  mStyles: [],
  mErrorStyle: "",
  mSkipuntilStyle: "",

  mFirstContextId: null,

  // options
  mCaseInsensitive: false,

  mResolver: new RegExp("\{[a-zA-Z][a-zA-Z0-9]*\}", "g"),

  getGrammarName: function()
  {
    return this.mName;
  },

  getDeftokens: function()
  {
    return this.mDeftokens;
  },

  isCaseInsensitive: function()
  {
    return this.mCaseInsensitive;
  },

  convertToUnicode: function(aCharset, aSrc )
  {
    // http://lxr.mozilla.org/mozilla/source/intl/uconv/idl/nsIScriptableUConv.idl
    var unicodeConverter = Components.classes[this.kUnicodeConverterCID]
                             .createInstance(this.nsIScriptableUnicodeConverter);
    unicodeConverter.charset = aCharset;
    return unicodeConverter.ConvertToUnicode( aSrc );
  },

  init: function(aChromeURL)
  {
    this.mChromeURL = aChromeURL;
    
    // Get the grammar file
    // var urlspec="chrome://diavolo/content/css.xml";
    var ioService = Components.classes[this.kIOServiceCID]
                      .getService(this.nsIIOService);

    // Get the baseURI
    var url = ioService.newURI(aChromeURL, null, null);

    var chann = ioService.newChannelFromURI(url);
    var inputStream = Components.classes[this.kFileInputStreamCID]
                        .createInstance(this.nsIFileInputStream);
    var sis = Components.classes[this.kScriptableInputCID]
                .createInstance(this.nsIScriptableInputStream);

    sis.init(chann.open());
    var str = sis.read(sis.available());
    sis.close();
    str = this.convertToUnicode("UTF-8",str);
    var parser = new DOMParser();
    this.mGrammarDocument = parser.parseFromString(str, "text/xml");

    this.mName = this.mGrammarDocument.documentElement.getAttribute("name");

    this.initRegExps();
    this.getContexts();
    this.initStyles();

    // cleanup
    this.mRegExps = null;
    this.mGrammarDocument = null;
  },

  initRegExps: function()
  {
    var regexps = this.mGrammarDocument.getElementsByTagName("regexp");
    var length = regexps.length;
    for (var i = 0; i < length; i++)
    {
      var r     = regexps.item(i);
      var name  = r.getAttribute("name");
      var value = r.getAttribute("value");

      this.mRegExps[name] = {value: value, resolved: false};
    }

    this.resolveAllRegexps();
    this.getOptions();
    this.resolveDeftokens();
  },

  resolveAllRegexps: function()
  {
    for (var i in this.mRegExps)
      this.resolveRegexp(i);
  },

  resolveRegexp: function(aName)
  {
      if (!this.mRegExps[aName].resolved)
      {
        var value = this.mRegExps[aName].value;
        var match = value.match(this.mResolver);
        if (match)
        {
          for (var j = 0; j < match.length; j++)
          {
            var m = match[j];
            var subRegexp = m.substring(1, m.length - 1);
            this.resolveRegexp(subRegexp);

            var r = new RegExp( "\{" + subRegexp + "\}", "g" )
            value = value.replace(r, "(" + this.mRegExps[subRegexp].value + ")");
          }
          this.mRegExps[aName].value = value;
        }
        this.mRegExps[aName].resolved = true;
      }
  },

  getOptions: function()
  {
    var options = this.mGrammarDocument.getElementsByTagName("option");
    var length = options.length;
    for (var i = 0; i < length; i++)
    {
      var option = options.item(i);
      var type = option.getAttribute("type");
      switch (type)
      {
        case "case-insensitive":
          this.mCaseInsensitive = true;
          break;
        default:
          break;
      }
    }
  },

  resolveDeftokens: function()
  {
    var deftokens = this.mGrammarDocument.getElementsByTagName("deftoken");
    var length = deftokens.length;
    for (var i = 0; i < length; i++)
    {
      var t = deftokens.item(i);
      var name = t.getAttribute("name");
      var type, value;
      if (t.hasAttribute("string"))
      {
        type = this.kSTRING_TOKEN;
        value = t.getAttribute("string");        
      }
      else
      {
        type = this.kREGEXP_TOKEN;
        value = new RegExp(this.mRegExps[t.getAttribute("regexp")].value,
                           this.mCaseInsensitive ? "iy" : "y");
      }
      this.mDeftokens[name] = { type: type, value: value};
    }
  },

  getNextToken: function getNextToken(aSourceString, aLastIndex)
  {
    if (aLastIndex >= aSourceString.length)
      return null;
    var tokens = this.mDeftokens;
    var tokenFound = false;
    var tokenName = "";
    var tokenString = "";
    for (var i in tokens)
    {
      var token = tokens[i];
      switch (token.type)
      {
        case this.kSTRING_TOKEN:
          {
            var s = token.value;
            var l = s.length;
            if (aSourceString.substr(aLastIndex, l) == s)
            {
              tokenName = i;
              tokenString = s;
              tokenFound = true;
            }
          }
          break;
        case this.kREGEXP_TOKEN:
          {
            var r = token.value;
            r.lastIndex = aLastIndex;
            var result = r.exec(aSourceString); 
            if (result)
            {
              tokenName = i;
              tokenString = result[0];
              tokenFound = true;
            }
          }
          break;
        default: // we should never reach this
          break;
      }
      if (tokenFound)
        break;
    }
    if (tokenFound)
      return {name: tokenName, string: tokenString, error: false};
    return {name: "", string: aSourceString[aLastIndex], error: true};
  },

  getContexts: function getContexts()
  {
    var contexts = this.mGrammarDocument.getElementsByTagName("context");

    if (contexts.length)
      this.mFirstContextId = contexts.item(0).getAttribute("id");

    for (var k = 0; k < contexts.length; k++) 
    {
      var c = contexts.item(k);
      var contextName = c.getAttribute("id");
      this.mContexts[contextName] = {};
      // get all error handlers
      var skipuntils = {};
      var errorsElts = c.getElementsByTagName("error");
      for (var i = 0; i < errorsElts.length; i++) 
      {
        var e = errorsElts.item(i);
        skipuntils[e.getAttribute("skipuntil")] = e.getAttribute("expecting");
      }
      this.mContexts[contextName].skipuntils = skipuntils;

      // now find all tokens to ignore in this context
      var ignores = {};
      var ignoreElts = c.getElementsByTagName("ignore");
      
      if (ignoreElts && ignoreElts.length) 
      {
        
        if (ignoreElts.length > 1) 
          dump("more than one <ignore> element found in context " + contextName + "\n")
        var ignoreElt = ignoreElts.item(0);
        var typeElts = ignoreElt.getElementsByTagName("type");
        for (var i = 0; i < typeElts.length; i++) 
        {
          var t = typeElts.item(i);
          ignores[t.getAttribute("name")] = true;
        }
      }
      this.mContexts[contextName].ignores = ignores;

      // and now finally tokens
      var tokens = [];
      var tokenElts = c.getElementsByTagName("token");
      for (var i = 0; i < tokenElts.length; i++) 
      {
        t = tokenElts.item(i);
        var ttype = t.getAttribute("type");
        var tlookahead = t.hasAttribute("lookahead") ? t.getAttribute("lookahead") : null;
        var trole = t.getAttribute("role");
        var texpecting = t.getAttribute("expecting");
        tokens.push({
          type: ttype,
          lookahead: tlookahead,
          role: trole,
          expecting: texpecting
        });
        // we need to keep track of all roles for color management
        if (!(trole in this.mRoles))
          this.mRoles[trole] = true;
      }
      this.mContexts[contextName].tokens = tokens;
    }
  },

  initStyles: function initStyles()
  {
    var stylesets = this.mGrammarDocument.getElementsByTagName("styleset");
    if (!stylesets || !stylesets.length)
      return;
    var styles = stylesets[0].getElementsByTagName("style");
    for (var i = 0; i < styles.length; i++)
    {
      var s = styles.item(i);
      var role = s.getAttribute("role");
      var forToken = s.hasAttribute("forToken")
                     ? s.getAttribute("forToken")
                     : "";
      var value = s.getAttribute("value");

      this.mStyles.push( { role:     role,
                           forToken: forToken,
                           value:    value }); 
    }

    var errorstyles = stylesets[0].getElementsByTagName("errorstyle");
    if (errorstyles && errorstyles.length)
    {
      this.mErrorStyle = errorstyles[0].getAttribute("value"); 
    }

    var skipuntilstyles = stylesets[0].getElementsByTagName("skipuntilstyle");
    if (skipuntilstyles && skipuntilstyles.length)
    {
      this.mSkipuntilStyle = skipuntilstyles[0].getAttribute("value"); 
    }
  },

  buildStylesheet: function buildStylesheet()
  {
    var cssText = "";

    cssText += "*[error='true'] {" + this.mErrorStyle + "}\n";
    cssText += ".SKIPUNTIL {" + this.mSkipuntilStyle + "}\n";

    for (var i = 0; i < this.mStyles.length; i++)
    {
      var s = this.mStyles[i];
      cssText += "." + s.role
                     + (s.forToken ? "[token='" + s.forToken + "']"
                                   : "")
                     + " {"
                     + s.value
                     + "}\n"; 
    }

    return cssText;
  },

  getRoles: function getRoles()
  {
    var res = [];
    for (var i in this.mRoles)
      res.push(i);
    return res;
  },

  getTokens: function getTokens()
    {
    var res = [];
    for (var i in this.mDeftokens)
      res.push(i);
    return res;
  },

  getStyles: function getStyles(aRole, aForToken)
  {
    return this.mStyles;
  },

  setStyles: function setStyles(aStyles)
  {
    this.mStyles = aStyles;
  },

  getErrorStyle: function getErrorStyle()
  {
    return this.mErrorStyle;
  },
  
  setErrorStyle: function setErrorStyle(aStyle)
  {
    this.mErrorStyle = aStyle;
  },
  
  getSkipuntilStyle: function getSkipuntilStyle()
  {
    return this.mSkipuntilStyle;
  },
  
  setSkipuntilStyle: function setSkipuntilStyle(aStyle)
  {
    this.mSkipuntilStyle = aStyle;
  }
  
};

