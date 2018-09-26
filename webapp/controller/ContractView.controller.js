sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("recn.RECN.controller.ContractView", {

/*		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/RE_CN_EXTERNAL_ODATA_SRV", true);
			this.getView().setModel(oModel,"contractModel");
			oRouter.getRoute("TargetMainView").attachPatternMatched(this._onObjectMatched, this);
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
		}*/

	});
});