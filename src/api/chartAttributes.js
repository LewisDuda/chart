import api from "./api.js";

const USER_ENDPOINT = "/chartAttributes";

export default {
	GET_ALL_TOOLS() {
		return api
			.get(USER_ENDPOINT)
			.then((res) => {
				return { status: 200, data: res.data };
			})
			.catch((err) => {
				return { status: err.response.status };
			});
	},
	CHECK_TOOL_CHARTNAME_DUPLICATE(config) {
		return api
			.get(USER_ENDPOINT + config)
			.then((res) => {
				if (res.data.length === 0) {
					return { duplicate: false };
				} else {
					return { duplicate: true };
				}
			})
			.catch((err) => {
				return { status: err.response.status };
			});
	},
	GET_ALL_CHART_NAME_IN_TARGET_TOOL(payload) {
		const axiosConfig = "?tool=" + payload;
		return api
			.get(USER_ENDPOINT + axiosConfig)
			.then((res) => {
				return { status: 200, data: res.data };
			})
			.catch((err) => {
				return { status: err.response.status };
			});
	},
	GET_TARGET_CHART_ATTRIBUTE(config) {
		return api
			.get(USER_ENDPOINT + config)
			.then((res) => {
				return { status: 200, data: res.data[0] };
			})
			.catch((err) => {
				return { status: err.response.status };
			});
	},
	POST_CHART_ATTRIBUTES(data) {
		return api
			.post(USER_ENDPOINT, data)
			.then((res) => {
				return { status: 200 };
			})
			.catch((err) => {
				return { status: err.response.status };
			});
	},
	DELETE_CHART_ATTRIBUTE(payload) {
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
