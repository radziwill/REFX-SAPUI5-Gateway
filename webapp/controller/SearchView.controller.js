sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("recn.RECN.controller.SearchView", {

		onInit: function () {
			var oModel, oView;
			oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/RE_CN_EXTERNAL_ODATA_SRV", true);
			oView = this.getView();
			oView.setModel(oModel);
		},

		onSearch: function (e) {
			var v1 = this.getView().byId("iCompanyCode").getValue();
			var v2 = this.getView().byId("iContract").getValue();
			var v3 = this.getView().byId("iContractType").getValue();
			var aSearchValue = [v1,v2,v3];
			var aAttributes = ["CompanyCode", "RealEstateContract", "REContractType"];
			var aFilters = [];
			for (var i in aSearchValue) {
				if (aSearchValue[i].length > 0) {
					var oFilter = new Filter(aAttributes[i], sap.ui.model.FilterOperator.Contains, aSearchValue[i]);
					aFilters.push(oFilter);
				}
			}
			this.getView().byId("idContractsTable").getBinding("items").filter(aFilters,
				"Application");

		},
		
		onPress: function(e) {
			var oItem = e.getSource();
			this.getOwnerComponent().getRouter().navTo("TargetMainView", {
					objectId: oItem.getBindingContext().getProperty("CompanyCode") + oItem.getBindingContext().getProperty("RealEstateContract")
				});
		}

	});
});