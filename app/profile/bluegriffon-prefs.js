#filter substitution

pref("toolkit.defaultChromeURI", "chrome://bluegriffon/content/xul/bluegriffon.xul");

// mandatory for XULrunner apps
// see https://developer.mozilla.org/en/XUL/prefwindow
pref("browser.preferences.instantApply", true);

/* debugging prefs */
pref("browser.dom.window.dump.enabled", true);
pref("javascript.options.showInConsole", true);
pref("javascript.options.strict", true);
pref("nglayout.debug.disable_xul_cache", true);
pref("nglayout.debug.disable_xul_fastload", true);

pref("general.useragent.extra.mybrowser", "@APP_UA_NAME@/@APP_VERSION@");

pref("extensions.update.enabled", true);
pref("extensions.update.url", "chrome://mozapps/locale/extensions/extensions.properties");
pref("extensions.update.interval", 86400);  // Check for updates to Extensions and 
                                            // Themes every week
// Non-symmetric (not shared by extensions) extension-specific [update] preferences
pref("extensions.getMoreExtensionsURL", "chrome://mozapps/locale/extensions/extensions.properties");
pref("extensions.getMoreThemesURL", "chrome://mozapps/locale/extensions/extensions.properties");
pref("extensions.dss.enabled", false);          // Dynamic Skin Switching                                               
pref("extensions.dss.switchPending", false);    // Non-dynamic switch pending after next
                                                // restart.
// browser preferences
pref("bluegriffon.display.use_system_colors", true);
pref("bluegriffon.display.foreground_color", "#000000");
pref("bluegriffon.display.background_color", "#ffffff");
pref("bluegriffon.display.active_color", "#ee0000");
pref("bluegriffon.display.anchor_color", "#0000ee");
pref("bluegriffon.display.visited_color", "#551a8b");
pref("bluegriffon.display.underline_links", true);
pref("bluegriffon.returnKey.createsParagraph", true);

// document preferences
pref("bluegriffon.author", "");

// table preferences
pref("bluegriffon.defaults.table.halign", "");
pref("bluegriffon.defaults.table.valign", "");
pref("bluegriffon.defaults.table.border", "1");
pref("bluegriffon.defaults.table.rows", "2");
pref("bluegriffon.defaults.table.cols", "2");
pref("bluegriffon.defaults.table.width", "100");
pref("bluegriffon.defaults.table.width_unit", "percentage");
pref("bluegriffon.defaults.table.text_wrap", "");
pref("bluegriffon.defaults.table.cell_spacing", "2");
pref("bluegriffon.defaults.table.cell_padding", "2");

// CSS policy
pref("bluegriffon.css.policy", 0); // 0: HTML Attr; 1: Inline styles; 2: embedded CSS Rules; 3: existing rule 

pref("bluegriffon.prettyprint", true);
pref("bluegriffon.encode_entity", "html");

pref("bluegriffon.zoom.default", "1.5");

pref("bluegriffon.history.url_maximum", 10);

pref("signon.rememberSignons", true);
pref("signon.expireMasterPassword", false);
pref("signon.SignonFileName", "signons.txt");

// suppress external-load warning for standard browser schemes
pref("network.protocol-handler.warn-external.http", false);
pref("network.protocol-handler.warn-external.https", false);
pref("network.protocol-handler.warn-external.ftp", false);

// XPI
pref("xpinstall.dialog.confirm", "chrome://mozapps/content/xpinstall/xpinstallConfirm.xul");
pref("xpinstall.dialog.progress.skin", "chrome://mozapps/content/extensions/extensions.xul");
pref("xpinstall.dialog.progress.chrome", "chrome://mozapps/content/extensions/extensions.xul");
pref("xpinstall.dialog.progress.type.skin", "Extension:Manager");
pref("xpinstall.dialog.progress.type.chrome", "Extension:Manager");


pref("dom.storage.enabled", true);

// structurebar
pref("bluegriffon.structurebar.id.show", true);
pref("bluegriffon.structurebar.class.show", true);
pref("bluegriffon.structurebar.lang.show", false);

// updates
pref("bluegriffon.updates.check.enabled", true);
pref("bluegriffon.updates.frequency", "launch");
