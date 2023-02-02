import { createStore } from "vuex";
import chartAPIs from "../api/chart.js";
import chartAttributesAPIs from "../api/chartAttributes.js";
import Swal from "sweetalert2";

// Sweetalert2 options
const SuccessToast = Swal.mixin({
	toast: true,
	position: "top",
	iconColor: "white",
	customClass: {
		popup: "colored-toast",
	},
	showConfirmButton: false,
	timer: 900,
	timerProgressBar: true,
});
const ErrorToast = Swal.mixin({
	toast: true,
	position: "top",
	iconColor: "white",
	customClass: {
		popup: "colored-toast",
	},
	showConfirmButton: false,
	timer: 2000,
	timerProgressBar: true,
});

const store = createStore({
	state() {
		return {
			basicChartAttributes: [],
			toolOptions: [],
			chartNameOptions: [],
			chamberOptions: [],
			basicItems: [],
			advancedItems: [],
			basicChartDetail: [],
			searchType: null,
			advancedSearchType: null,
			advancedSelected: [],
			advancedChartDetail: {
				tool: "",
				chartName: "",
				yAxialTitle: "",
				chartTitle: "",
				maxSpec: 100,
				minSpec: 0,
				target: 50,
				max: 100,
				min: 0,
				ticksSteps: 10,
				isShowLegend: true,
				chartTitleSize: 25,
				yTitleSize: 15,
				xLabelSize: 12,
				xSubLabelSize: 12,
				yLabelSize: 12,
				chartTitleWeight: 700,
				yTitleWeight: 700,
				xLabelWeight: 100,
				xSubLabelWeight: 100,
				yLabelWeight: 100,
				lineWidth: 2,
				pointRadius: 2,
				lineRadian: 0.01,
				xSubLabelAngle: 0,
				isShowXSubLabel: true,
				breakLine: [],
			},
		};
	},
	getters: {
		processBasicItems(state) {
			if (state.searchType === 1) {
				state.basicItems.map((item, index) => {
					item.isChamberEdit = false;
					item.isValueEdit = false;
					item.index = index;
					item.col1 = "date";
					item.col2 = "chamber";
					item.col1Value = item.date;
					item.col2Value = item.chamber;
				});
				return state.basicItems;
			}
			if (state.searchType === 2) {
				state.basicItems.map((item, index) => {
					item.isChamberEdit = false;
					item.isValueEdit = false;
					item.index = index;
					item.col1 = "chamber";
					item.col2 = "date";
					item.col1Value = item.chamber;
					item.col2Value = item.date;
				});
				return state.basicItems;
			}
		},
		datesGrouping(state) {
			let obj = {};
			for (let i in state.basicItems) {
				let key = state.basicItems[i].date;
				obj[key] = {
					unit: key, // unit is date
					count: obj[key] && obj[key].count ? obj[key].count + 1 : 1,
					type: "date",
				};
			}
			return Object.values(obj);
		},
		chambersGrouping(state) {
			let obj = {};
			for (let i in state.basicItems) {
				let key = state.basicItems[i].chamber;
				obj[key] = {
					unit: key, // unit is chamber
					count: obj[key] && obj[key].count ? obj[key].count + 1 : 1,
					type: "chamber",
				};
			}
			return Object.values(obj);
		},
	},
	actions: {
		async initChartAttributes({ commit }, payload) {
			const { axiosConfig, chartAttributes } = payload;
			const res = await chartAttributesAPIs.GET_TARGET_CHART_ATTRIBUTE(
				axiosConfig
			);
			const { status, data } = res;

			if (status === 404) {
				ErrorToast.fire({
					icon: "error",
					title: "Oops, Get chart attributes fail!",
				});
			}

			if (chartAttributes === "basic") {
				commit("INIT_BASIC_CHART_ATTRIBUTES", data);
			}
		},
		async initToolOptions({ commit }, payload) {
			const res = await chartAttributesAPIs.GET_ALL_TOOLS();
			const { status, data } = res;
			if (status === 404) {
				ErrorToast.fire({
					icon: "error",
					title: "Oops, Get all tools fail!",
				});
			}

			const preArr = [];
			for (let i = 0; i < data.length; i++) {
				preArr[i] = data[i].tool;
			}

			const proccessArr = preArr.filter(function (element, index, arr) {
				return arr.indexOf(element) === index;
			});

			commit("INIT_TOOL_OTPIONS", proccessArr);
		},
		async addChartAttributes({ commit }, payload) {
			const res = await chartAttributesAPIs.POST_CHART_ATTRIBUTES(
				payload
			);
			const { status } = res;

			if (status === 200) {
				return SuccessToast.fire({
					icon: "success",
					title: "Add new chart success!",
				});
			}

			if (status === 404) {
				return ErrorToast.fire({
					icon: "error",
					title: "Oops, Add chartAttributes fail!",
				});
			}
		},
		async initChartNameOptions({ commit }, payload) {
			const res =
				await chartAttributesAPIs.GET_ALL_CHART_NAME_IN_TARGET_TOOL(
					payload
				);
			const { status, data } = res;

			if (status === 404) {
				return ErrorToast.fire({
					icon: "error",
					title: "Oops, Get chartName under the specified tool fail!",
				});
			}

			const arr = [];
			for (let i = 0; i < data.length; i++) {
				arr.push(data[i].chartName);
			}

			commit("INIT_CHARTNAME_OPTIONS", arr);
		},
		async initChamberOptions({ commit }, payload) {
			const res = await chartAPIs.GET_TARGET_CHAMBER(payload);
			let { status, data } = res;

			if (status === 404) {
				return ErrorToast.fire({
					icon: "error",
					title: "Oops, Get chamber under the specified tool and chartNmae fail!",
				});
			}

			let tempArr = [];
			for (let i = 0; i < res.data.length; i++) {
				tempArr[i] = res.data[i].chamber;
			}
			data = [...new Set(tempArr)];

			commit("INIT_CHAMBER_OPTIONS", data);
		},
		async addChartDatas({ commit }, payload) {
			const res = await chartAPIs.POST_CHART_DATA(payload);
			const { status, data } = res;

			if (status === 404) {
				return ErrorToast.fire({
					icon: "error",
					title: "Add chart data fail!",
				});
			}

			if (status === 200) {
				commit("ADD_CHART_DATAS", data);
				return SuccessToast.fire({
					icon: "success",
					title: "Add chart data success!",
				});
			}
		},
		async searchChartDatas({ commit }, payload) {
			const res = await chartAPIs.GET_CHART_DATAS(payload.axiosConfig);
			const { status, data } = res;

			if (status === 404) {
				return ErrorToast.fire({
					icon: "error",
					title: "Search chart datas fail!",
				});
			}
			commit("INIT_CHART_DATAS", {
				data: data,
				searchType: payload.searchType,
			});
		},
		async deletChart({ commit }, payload) {
			let deleteArr = [];
			let deleteDatasRes = "";

			const chartRes =
				await chartAttributesAPIs.GET_TARGET_CHART_ATTRIBUTE(payload);
			if (chartRes.status === 404) {
				return ErrorToast.fire({
					icon: "error",
					title: "Get target chart attributes fail!",
				});
			}

			const dataRes = await chartAPIs.GET_CHART_DATAS(payload);
			if (dataRes.status === 404) {
				return ErrorToast.fire({
					icon: "error",
					title: "Get target datas fail!",
				});
			}

			dataRes.data.forEach((item) => {
				deleteArr.push(item.id);
			});

			const deletChartRes =
				await chartAttributesAPIs.DELETE_CHART_ATTRIBUTE(
					chartRes.data.id
				);

			if (deletChartRes.status === 404) {
				return ErrorToast.fire({
					icon: "error",
					title: "Delete target chart attribute fail!",
				});
			}

			if (deleteArr.length === 0) {
				return window.location.reload();
			}

			for (const id of deleteArr) {
				deleteDatasRes = await chartAPIs.DELETE_CHART_DATA(id);
			}

			if (deleteDatasRes.status === 200) {
				await SuccessToast.fire({
					icon: "success",
					title: "Delete datas success!",
				});
				window.location.reload();
			}
		},
		async editChartData({ commit }, payload) {
			const res = await chartAPIs.EDIT_CHART_DATA(payload);
			const { status, data } = res;

			if (status === 404) {
				return ErrorToast.fire({
					icon: "error",
					title: "Edit chart data fail!",
				});
			}

			if (status === 200) {
				commit("EDIT_CHART_DATA", { index: payload.index, data: data });
				return SuccessToast.fire({
					icon: "success",
					title: "Edit chart data success!",
				});
			}
		},
		async deleteChartData({ commit }, payload) {
			const res = await chartAPIs.DELETE_CHART_DATA(payload.id);
			if (res.status === 404) {
				return ErrorToast.fire({
					icon: "error",
					title: "Delete chart data fail!",
				});
			}

			await commit("DELETE_CHART_DATA", payload.index);
			SuccessToast.fire({
				icon: "success",
				title: "Delete chart data success!",
			});
		},
		addPreSelection({ commit }, payload) {
			commit("ADD_ADVANCED_SELECTED", payload);
		},
		deletePreSelection({ commit }, payload) {
			commit("DELETE_ADVANCED_SELECTED", payload);
		},
		async start_init({ commit }, payload) {
			const attributes_res =
				await chartAttributesAPIs.GET_TARGET_CHART_ATTRIBUTE(
					"?tool=Tool1&chartName=Chart1"
				);
			const chart_res = await chartAPIs.GET_CHART_DATAS(
				"?tool=Tool1&chartName=Chart1&_sort=timestamp,sortChamber&_oder=asc,asc"
			);
			commit("INIT_BASIC_CHART_ATTRIBUTES", attributes_res["data"]);

			commit("INIT_CHART_DATAS", {
				data: chart_res["data"],
				searchType: 1,
			});
		},
	},
	mutations: {
		INIT_BASIC_CHART_ATTRIBUTES(state, payload) {
			state.basicChartAttributes = payload;
			state.basicChartDetail = {
				id: payload.id,
				tool: payload.tool,
				chartName: payload.chartName,
				yAxialTitle: payload.yAxialTitle,
				maxSpec: payload.maxSpec,
				minSpec: payload.minSpec,
				target: payload.target,
				max: payload.max,
				min: payload.min,
				ticksSteps: 10,
				isShowLegend: true,
				chartTitleSize: 25,
				yTitleSize: 15,
				xLabelSize: 12,
				xSubLabelSize: 12,
				yLabelSize: 12,
				chartTitleWeight: 700,
				yTitleWeight: 700,
				xLabelWeight: 100,
				xSubLabelWeight: 100,
				yLabelWeight: 100,
				lineWidth: 2,
				pointRadius: 2,
				lineRadian: 0.01,
				xSubLabelAngle: 0,
				isShowXSubLabel: true,
				breakLine: [],
			};
		},
		INIT_TOOL_OTPIONS(state, payload) {
			state.toolOptions = payload;
		},
		RESET__CHARTNAME_OPTIONS(state) {
			state.chartNameOptions = [];
		},
		INIT_CHARTNAME_OPTIONS(state, payload) {
			state.chartNameOptions = payload;
		},
		INIT_CHAMBER_OPTIONS(state, payload) {
			state.chamberOptions = payload;
		},
		INIT_CHART_DATAS(state, payload) {
			const { data, searchType } = payload;

			state.basicItems = data;
			state.searchType = searchType;

			let tempArr = [];
			for (let i = 0; i < data.length; i++) {
				tempArr.push(data[i].value);
			}

			state.basicChartDetail.max = Math.max(...tempArr) + 10;
			state.basicChartDetail.maxSpec = Math.max(...tempArr) + 10;
		},
		EDIT_CHART_DATA(state, payload) {
			const { index, data } = payload;
			state.basicItems[index] = data;
		},
		DELETE_CHART_DATA(state, payload) {
			state.basicItems.splice([payload], 1);
		},
		ADD_ADVANCED_SELECTED(state, payload) {
			state.advancedSelected.push(payload);
		},
		DELETE_ADVANCED_SELECTED(state, payload) {
			if (payload === "all") {
				state.advancedSelected.splice(0, state.advancedSelected.length);
			} else {
				state.advancedSelected.splice(payload, 1);
			}
		},
		INIT_ADVANCED_CHART_DATAS(state, payload) {
			state.advancedItems = payload;

			let tempArr = [];
			for (let i = 0; i < payload.length; i++) {
				for (let j = 0; j < payload[i].length; j++) {
					tempArr.push(payload[i][j].value);
				}
			}

			state.advancedChartDetail.max = Math.max(...tempArr) + 10;
			state.advancedChartDetail.maxSpec = Math.max(...tempArr) + 10;
		},
		MODIFY_BREAK_LINE(state, payload) {
			const { type, handleType, item, index } = payload;

			if (type === "basic" && handleType === "Add") {
				return state.basicChartDetail.breakLine.push(item);
			}
			if (type === "basic" && handleType === "Delete") {
				return state.basicChartDetail.breakLine.splice(index, 1);
			}
			if (type === "advanced" && handleType === "Add") {
				console.log("sdf");
				return state.advancedChartDetail.breakLine.push(item);
			}
			if (type === "advanced" && handleType === "Delete") {
				return state.advancedChartDetail.breakLine.splice(index, 1);
			}
		},
	},
});

export default store;
