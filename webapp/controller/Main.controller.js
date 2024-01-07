sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("bc.dev.CODE_BUILDER.controller.Main", {
		onInit: function () {

			this.getView().addStyleClass("sapUiSizeCompact");

			this.srcTableResponsive = "";
			this.srcMock = "";
			this.srcForm = "";
			this.srcAnnota = "";
			this.TabKey = "";

			// this.oCore = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/zfiori_core_srv/");

			this.oEditor = this.byId("aCodeEditor");
			this.codeModel = new sap.ui.model.json.JSONModel({ source: "" });
			this.oEditor.setModel(this.codeModel);


			this.tableFields = this.byId("tableFields");
			var dataField = [{ field: "", title: "", type: "" }];
			this.tableModel = new sap.ui.model.json.JSONModel({ items: dataField });
			this.tableFields.setModel(this.tableModel);

			this.onChange();

		},

		buildCodeTableResponsive: function () {
			var entityName = this.byId("entityName").getValue();
			this.srcTableResponsive =
				'<Table items="{ path: (ENTITY), sorter: (SORTER), filters: (FILTERS)}">\n' +
				'\t<columns>\n(COLUMNS)\t</columns>\n' +
				'\t<items>\n\t\t<ColumnListItem>\n\t\t\t<cells>\n(CELLS)\t\t\t</cells>\n\t\t</ColumnListItem>\n\t</items>\n' +
				'</Table>';
			this.srcTableResponsive = this.srcTableResponsive.replace("(ENTITY)", "'/" + entityName + "'");

			this.tableModel.refresh();
			var oItems = this.tableFields.getItems();
			var columns = "", cells = "";
			for (var i in oItems) {
				var oObj = oItems[i].getBindingContext().getObject();

				if (oObj.title) {
					columns = columns + '\t\t<Column><Text text="' + oObj.title + '"/></Column>\n';
				}

				switch (oObj.type) {
					case "Tx":
						cells = cells + '\t\t\t\t<Text text="{' + oObj.field + '}"/>\n';
						break;
					case "In":
						cells = cells + '\t\t\t\t<Input value="{' + oObj.field + '}"/>\n';
						break;
					case "Mi":
						cells = cells + '\t\t\t\t<MultiInput selectedKey="{' + oObj.field + '}"/>\n';
						break;
					case "Co":
						cells = cells + '\t\t\t\t<ComboBox selectedKey="{' + oObj.field + '}"/>\n';
						break;
					case "Mc":
						cells = cells + '\t\t\t\t<MultiComboBox selectedKey="{' + oObj.field + '}"/>\n';
						break;
					case "Cx":
						cells = cells + '\t\t\t\t<CheckBox selected="{= ${' + oObj.field + '} === \'X\' }"/>\n';
						break;
					case "Sw":
						cells = cells + '\t\t\t\t<Switch state="{' + oObj.field + '}"/>\n';
						break;
					default:
						cells = cells + '\t\t\t\t<Text text="{' + oObj.field + '}"/>\n';
						break;
				}

			}
			if (columns) {
				this.srcTableResponsive = this.srcTableResponsive.replace("(COLUMNS)", columns);
			}
			if (cells) {
				this.srcTableResponsive = this.srcTableResponsive.replace("(CELLS)", cells);
			}


		},

		buildCodeTableGrid: function () {
			var entityName = this.byId("entityName").getValue();
			this.srcTableGrid =
				'<ui:Table rows="{ path: (ENTITY), sorter: (SORTER), filters: (FILTERS)}">\n' +
				'\t<ui:columns>\n(COLUMNS)\t</ui:columns>\n' +
				'</ui:Table>';
			this.srcTableGrid = this.srcTableGrid.replace("(ENTITY)", "'/" + entityName + "'");

			this.tableModel.refresh();
			var oItems = this.tableFields.getItems();
			var columns = "", cell = "", title = "";
			for (var i in oItems) {
				var oObj = oItems[i].getBindingContext().getObject();

				title = oObj.title;
				if (!title && oObj.field) {
					title = "{i18n>" + oObj.field + "}"
				}

				switch (oObj.type) {
					case "Tx":
						cell = '<Text text="{' + oObj.field + '}"/>';
						break;
					case "In":
						cell = '<Input value="{' + oObj.field + '}"/>';
						break;
					case "Mi":
						cell = '<MultiInput selectedKey="{' + oObj.field + '}"/>';
						break;
					case "Co":
						cell = '<ComboBox selectedKey="{' + oObj.field + '}"/>';
						break;
					case "Mc":
						cell = '<MultiComboBox selectedKey="{' + oObj.field + '}"/>';
						break;
					case "Cx":
						cell = '<CheckBox selected="{= ${' + oObj.field + '} === \'X\' }"/>';
						break;
					case "Sw":
						cell = '<Switch state="{' + oObj.field + '}"/>';
						break;
					default:
						cell = '<Text text="{' + oObj.field + '}"/>';
						break;
				}

				columns = columns + '\t\t<ui:Column label="' + title + '" autoResizable="true">\n' +
					'\t\t\t<ui:template>\n\t\t\t\t' + cell + '\n\t\t\t</ui:template> \n \t\t </ui:Column>\n';

			}
			if (columns) {
				this.srcTableGrid = this.srcTableGrid.replace("(COLUMNS)", columns);
			}


		},

		buildCodeMock: function () {
			var entityName = this.byId("entityName").getValue();
			this.srcMock = '{ "' + entityName + '": [ \n { \n(FIELDS) }\n]}';

			this.tableModel.refresh();
			var oItems = this.tableFields.getItems();
			var fields = "";
			for (var i in oItems) {
				var oObj = oItems[i].getBindingContext().getObject();

				if ((i + 1) < oItems.length) {
					fields = fields + '\t"' + oObj.field + '": "",\n';
				} else {
					//Last
					fields = fields + '\t"' + oObj.field + '": ""\n';
				}
			}
			this.srcMock = this.srcMock.replace("(FIELDS)", fields);

		},

		buildCodeForm: function () {
			// var entityName = this.byId("entityName").getValue();
			this.srcForm =
				'<f:SimpleForm>\n\t<f:content> \n(FIELDS) \n\t</f:content>\n</f:SimpleForm>';

			this.tableModel.refresh();
			var oItems = this.tableFields.getItems();

			var fields = "";
			for (var i in oItems) {

				var oObj = oItems[i].getBindingContext().getObject();

				if (oObj.title) {
					fields = fields + '\t\t<Label text="' + oObj.title + '"/>\n';
				}else{
					fields = fields + '\t\t<Label text="{i18n>' + oObj.field + '}"/>\n';
				}

				switch (oObj.type) {
					case "Tx":
						fields = fields + '\t\t<Text text="{' + oObj.field + '}"/>\n';
						break;
					case "In":
						fields = fields + '\t\t<Input value="{' + oObj.field + '}"/>\n';
						break;
					case "Mi":
						fields = fields + '\t\t<MultiInput selectedKey="{' + oObj.field + '}"/>\n';
						break;
					case "Co":
						fields = fields + '\t\t<ComboBox selectedKey="{' + oObj.field + '}"/>\n';
						break;
					case "Mc":
						fields = fields + '\t\t<MultiComboBox selectedKey="{' + oObj.field + '}"/>\n';
						break;
					case "Cx":
						fields = fields + '\t\t<CheckBox selected="{= ${' + oObj.field + '} === \'X\' }"/>\n';
						break;
					case "Sw":
						fields = fields + '\t\t<Switch state="{' + oObj.field + '}"/>\n';
						break;
					default:
						fields = fields + '\t\t<Text text="{' + oObj.field + '}"/>\n';
						break;
				}

			}
			// var fields = fields + 
			this.srcForm = this.srcForm.replace("(FIELDS)", fields);

		},

		buildCodeAnnotations: function () {
			this.tableModel.refresh();
			var oItems = this.tableFields.getItems();
			this.srcAnnota = "";

			for (var i in oItems) {

				var oObj = oItems[i].getBindingContext().getObject();

				if (oObj.field) {
					this.srcAnnota = this.srcAnnota +
						'<Record Type="UI.DataField">\n\t<PropertyValue Property="Value" Path="' +
						oObj.field +
						'"/> \n\t<Annotation Term="UI.Importance" EnumMember="UI.Importance/High"/>\n</Record>\n';
				}

			}

		},

		setCode: function () {

			var abaKey = this.byId("iconTabHeader").getSelectedKey();

			var displayCode = "";
			switch (abaKey) {
				case "A":
					displayCode = this.srcTableResponsive;
					this.oEditor.setType("xml");
					break;
				case "B":
					displayCode = this.srcTableGrid;
					this.oEditor.setType("xml");
					break;
				case "C":
					displayCode = this.srcMock;
					this.oEditor.setType("json");
					break;
				case "D":
					displayCode = this.srcForm;
					this.oEditor.setType("xml");
					break;
				case "E":
					displayCode = this.srcAnnota;
					this.oEditor.setType("xml");
					break;
				default:
					displayCode = "";
					break;
			}

			var data = this.codeModel.getData();
			data.source = displayCode;
			this.codeModel.refresh();
			// this.oEditor.setValue(displayCode);
			// this.oEditor.prettyPrint();
		},

		addItem: function () {

			var data = this.tableModel.getData();
			data.items.push({ field: "", title: "", type: "" });
			this.tableModel.refresh();

		},

		deleteItem: function (oEvent) {
			var data = this.tableModel.getData();
			var oItem = oEvent.getParameter("listItem");
			var indexSelect = this.tableFields.indexOfItem(oItem);
			data.items.splice(indexSelect, 1);
			this.tableModel.refresh();

		},

		onSelectTab: function (oEvent) {
			this.setCode();
		},

		onChange: function () {

			this.buildCodeTableResponsive();
			this.buildCodeTableGrid();
			this.buildCodeMock();
			this.buildCodeForm();
			this.buildCodeAnnotations();

			this.setCode();

		},

		liveChangeField: function (oEvent) {
			this.checkSplitLine(oEvent);
		},

		checkSplitLine: function (oEvent) {

			if (!oEvent) {
				return;
			}
			var aValue = encodeURI(oEvent.getParameter("value"));
			var aValues = aValue.split("%20");

			if (aValues.length > 1) {
				//Quando é mais de um valor quebra em linhas

				var oInput = oEvent.getSource(),
					oItem = oInput.getParent(),
					oTab = oItem.getParent(),
					aItems = oTab.getItems(),
					position = oTab.indexOfItem(oItem);


				for (var i = 0; i < aValues.length; i++) {
					var text = aValues[i];
					if (i === 0) {
						var firstText = text;
						oInput.setValue(firstText);
					} else {
						position++;
						oItem = aItems[position];
						if (oItem) {
							var nextInput = oItem.getCells()[0];
							nextInput.setValue(text);
						}
					}
				}
			}
		},


	});
});