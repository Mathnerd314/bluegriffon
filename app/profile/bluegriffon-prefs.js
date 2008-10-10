#filter substitution

pref("toolkit.defaultChromeURI", "chrome://bluegriffon/content/bluegriffon.xul");

/* debugging prefs */
pref("browser.dom.window.dump.enabled", true);
pref("javascript.options.showInConsole", true);
pref("javascript.options.strict", true);
pref("nglayout.debug.disable_xul_cache", true);
pref("nglayout.debug.disable_xul_fastload", true);

pref("general.useragent.extra.mybrowser", "@MOZ_APP_NAME@/@COMPOSER_VERSION@");

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
pref("browser.display.use_system_colors", true);
pref("browser.display.foreground_color", "#000000");
pref("browser.display.background_color", "#ffffff");
pref("browser.active_color", "#ee0000");
pref("browser.anchor_color", "#0000ee");
pref("browser.visited_color", "#551a8b");

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
pref("bluegriffon.css.policy", 2); // 0: HTML Attr; 1: Inline styles; 2: embedded CSS Rules; 3: existing rule 

pref("bluegriffon.prettyprint", true);
pref("bluegriffon.encode_entity", "html");

pref("bluegriffon.zoom.default", "1");

pref("bluegriffon.history.url_maximum", 10);
