import api from "./api.js";

const USER_ENDPOINT = "/chart";

export default {
	GET_CHART_DATAS(config) {
		return api
			.get(USER_ENDPOINT + config)
			.then((res) => {
				return { status: 200, data: res.data };
			})
			.catch((err) => {
				return { status: err.response.status };
			});
	},
	GET_TARGET_CHAMBER(config) {
		return api
			.get(USER_ENDPOINT + config)
			.then((res) => {
				return { status: 200, data: res.data };
			})
			.catch((err) => {
				return { status: err.response.status };
			});
	},
	POST_CHART_DATA(payload) {
		return api
			.post(USER_ENDPOINT, payload)
			.then((res) => {
				return { status: 200, data: res.data };
			})
			.catch((err) => {
				return { status: err.response.status };
			});
	},
	EDIT_CHART_DATA(payload) {
		return api
			.patch(USER_ENDPOINT + "/" + payload.id, payload.updateData)
			.then((res) => {
				return { status: 200, data: res.data };
			})
			.catch((err) => {
				return { status: err.response.status };
			});
	},
	DELETE_CHART_DATA(payload) {
		return api
			.delete(USER_ENDPOINT + "/" + payload)
			.then((res) => {
				return { status: 200 };
			})
			.catch((err) => {
				return { status: err.response.status };
			});
	},
};
