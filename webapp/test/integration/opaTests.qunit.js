/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"bc/dev/CODE_BUILDER/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});