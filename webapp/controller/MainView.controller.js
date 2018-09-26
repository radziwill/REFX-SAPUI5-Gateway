sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("recn.RECN.controller.MainView", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/RE_CN_EXTERNAL_ODATA_SRV", true);
			this.getView().setModel(oModel,"contractModel");
			oRouter.getRoute("TargetMainView").attachPatternMatched(this._onObjectMatched, this);
			//this.getRouter().getRoute("TargetMainView").attachPatternMatched(this._onObjectMatched, this);
		},
		
		onNavBack: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("TargetSearchView");
		},
		
		_onObjectMatched: function (e) {
			var sObjectId = e.getParameter("arguments").objectId.toString();
			var sObjectPath = this.getView().getModel("contractModel").createKey("HeaderDataSet", {
				CompanyCode: sObjectId.toString().substring(0, 4),
				RealEstateContract: sObjectId.toString().substring(4, sObjectId.toString().length)
			});
			this.getView().bindElement({
				path: "/" + sObjectPath,
				model: "contractModel"
			});
		}

/*		handleNav: function (e) {
			var navCon = this.byId("navCon");
			var target = e.getSource().data("target");
			if (target) {
				navCon.to(this.byId(target));
			} else {
				navCon.back();
			}
		}*/

	});
});