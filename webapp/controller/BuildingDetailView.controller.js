sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/m/Input",
	"sap/m/Label",
	"sap/m/Dialog",
	"sap/m/MessageBox",
	"sap/m/DatePicker",
	"sap/m/Button"
], function (Controller, History, MessageToast, Input, Label, Dialog, MessageBox, DatePicker, Button) {
	"use strict";

	return Controller.extend("recn.RECN.controller.BuildingDetailView", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZRE_BU_BUILDING_ODATA_SRV", true);
			oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			oModel.setHeaders({
				"Content-Type": "application/json; charset=utf-8",
				"X-Requested-With": "XMLHttpRequest"
			});
			this.getView().setModel(oModel, "buildingsModel");
			oRouter.getRoute("TargetBuildingDetailView").attachPatternMatched(this._onObjectMatched, this);
			//this.getRouter().getRoute("TargetMainView").attachPatternMatched(this._onObjectMatched, this);
		},

		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("TargetSearchView", true);
			}
		},

		onSave: function () {
			var sPath = this.getView().getElementBinding("buildingsModel").getPath();
			var that = this;
			var oModel = this.getView().getModel("buildingsModel");
			var oData = oModel.getData(sPath);
			this.getView().getModel("buildingsModel").submitChanges({
				success: function () {
					MessageToast.show("Sukces");
				},
				error: function (e) {
					that._showServiceError(e.response);
				}
			});
			this.getView().getModel("buildingsModel").refreshMetadata();
		},

		onReset: function () {
			this.getView().getModel("buildingsModel").resetChanges();
		},

		onCreateMeasurement: function () {
			var sPath = this.getView().getElementBinding("buildingsModel").getPath();
			var oData = this.getView().getModel("buildingsModel").getData(sPath);
			var that = this;
			var dialog = new Dialog({
				title: 'Create',
				type: 'Message',
				content: [
					new Label({
						text: 'Create measurement'
					}),
					new Input('Meas', {
						width: '100%',
						placeholder: 'Measurement'
					}),
					new DatePicker('Validto', {
						width: '100%',
						value: {
							type: 'sap.ui.model.type.Date',
							formatOptions: {
								pattern: 'yyyy-MM-dd',
								strictParsing: true,
								UTC: true
							}
						}
					}),
					new DatePicker('Validfrom', {
						width: '100%',
						value: {
							type: 'sap.ui.model.type.Date',
							formatOptions: {
								pattern: 'yyyy-MM-dd',
								strictParsing: true,
								UTC: true
							}
						}
					}),
					new Input('Measvalue', {
						width: '100%',
						placeholder: 'Measurement value'
					}),
					new Input('Measunit', {
						width: '100%',
						placeholder: 'Measurement unit'
					}),
					new Button('Create', {
						text: 'Create',
						press: function () {
							that.getView().getModel("buildingsModel").create("/BuildingMeasurementSet", {
								Bukrs: that.getView().Bukrs,
								Swenr: that.getView().Swenr,
								Sgenr: that.getView().Sgenr,
								Meas: this.getParent().getContent()[1].getValue(),
								Validto: this.getParent().getContent()[2].getDateValue(),
								Validfrom: this.getParent().getContent()[3].getDateValue(),
								Measvalue: this.getParent().getContent()[4].getValue(),
								Measunit: this.getParent().getContent()[5].getValue()
							}, {
								success: function () {
									MessageToast.show("Dodano");
								},
								error: function (e) {
									that._showServiceError(e.response);
								}
							});
							that.getView().getModel("buildingsModel").updateBindings();
							this.getParent().destroy();
						}
					})
				],
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		requestFailed: function (e) {
			var oParams = e.getParameters();
			if (oParams.response.statusCode !== "400" &&
				oParams.response.statusCode !== "404") {
				this.getRouter().getTargetHandler().setCloseDialogs(false);
				this.getRouter().getTargets().display("notFound");
				this._showServiceError(oParams.response);
			}
		},

		_onObjectMatched: function (e) {
			var sObjectId = e.getParameter("arguments").objectId.toString();
			var aObjectId = sObjectId.split(" ");
			this.getView().Bukrs = aObjectId[0];
			this.getView().Swenr = aObjectId[1];
			this.getView().Sgenr = aObjectId[2];
			var sObjectPath = this.getView().getModel("buildingsModel").createKey("BuildingDataSet", {
				Bukrs: aObjectId[0],
				Swenr: aObjectId[1],
				Sgenr: aObjectId[2]
			});
			this.getView().bindElement({
				path: "/" + sObjectPath,
				model: "buildingsModel"
			});
		},

		_showServiceError: function (sDetails) {
			if (this._bMessageOpen) {
				return;
			}
			this._bMessageOpen = true;
			MessageBox.error("An ErrorOccurred", {
				details: sDetails,
				actions: [MessageBox.Action.CLOSE],
				onClose: function () {
					this._bMessageOpen = false;
				}.bind(this)
			});
		}

	});
});