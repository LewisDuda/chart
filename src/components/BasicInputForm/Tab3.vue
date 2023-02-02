<template>
	<form>
		<div class="content">
			<div class="group">
				<span>Tool Name:</span>
				<select v-model="form.tool" @click="handleInputTool">
					<option :value="form.tool" selected disabled hidden>
						{{ form.tool }}
					</option>
					<option
						v-for="option in toolOptions"
						:value="option"
						:key="option"
					>
						{{ option }}
					</option>
				</select>
			</div>
			<div class="group">
				<span>Chart Name:</span>
				<select v-model="form.chartName" @click="handleInputChartName">
					<option :value="form.chartName" selected disabled hidden>
						{{ form.chartName }}
					</option>
					<option
						v-for="option in chartNameOptions"
						:value="option"
						:key="option"
					>
						{{ option }}
					</option>
				</select>
			</div>
			<div class="group">
				<span>Start Date:</span>
				<input type="date" v-model="form.startDate" />
			</div>
			<div class="group">
				<span>End Date:</span>
				<input type="date" v-model="form.endDate" />
			</div>
			<div class="group">
				<span>Chamber:</span>
				<div class="checkbox-aria">
					<div class="checkbox">
						<input
							id="checkbox-all"
							type="checkbox"
							v-model="isCheckAll"
							@click="checkAll"
						/>
						<label for="checkbox-all">all</label>
					</div>
					<div
						class="checkbox"
						v-for="item in checkboxOptions"
						:key="item"
					>
						<input
							:id="item"
							type="checkbox"
							:value="item"
							v-model="selectedCheckbox"
							@change="updateCheckall()"
						/>
						<label :for="item">{{ item }}</label>
					</div>
				</div>
			</div>
		</div>
		<div class="btn-group">
			<button class="submit-btn" type="submit" @click.prevent="search">
				Search
			</button>
			<button class="cancel-btn" @click="cancel">Cancel</button>
			<button class="special-btn" @click="sepecialSearch">
				Comp. of MPC
			</button>
		</div>
	</form>
</template>
<script>
import { ref, reactive, computed } from "@vue/runtime-core";
import store from "../../store/index.js";
import Swal from "sweetalert2";

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

export default {
	setup() {
		const toolOptions = computed(() => store.state.toolOptions);
		const chartNameOptions = computed(() => store.state.chartNameOptions);
		const form = reactive({
			tool: "Please select tool name",
			chartName: "Please select chart name",
			startDate: "",
			endDate: "",
			chamber: "#",
		});
		const isCheckAll = ref(false);
		const selectedCheckbox = ref([]);
		const checkboxOptions = computed(() => store.state.chamberOptions);

		function handleInputTool() {
			chartNameOptions.value = [];
			form.chartName = "Please select chart name";
			store.dispatch("initChartNameOptions", form.tool);
		}

		function handleInputChartName() {
			const axiosConfig =
				"?tool=" +
				form.tool +
				"&chartName=" +
				form.chartName +
				"&_sort=sortChamber&_oder=asc";
			store.dispatch("initChamberOptions", axiosConfig);
		}

		function checkAll() {
			isCheckAll.value = !isCheckAll.value;
			selectedCheckbox.value = [];
			if (isCheckAll.value) {
				for (let i = 0; i < checkboxOptions.value.length; i++) {
					selectedCheckbox.value.push(checkboxOptions.value[i]);
				}
			}
		}

		function updateCheckall() {
			if (
				selectedCheckbox.value.length === checkboxOptions.value.length
			) {
				isCheckAll.value = true;
			} else {
				isCheckAll.value = false;
			}
		}

		function search() {
			const sortOrder = "&_sort=timestamp,sortChamber&_oder=asc,asc";
			searchModule(1, sortOrder);
			selectedCheckbox.value = [];
			isCheckAll.value = false;
		}

		function sepecialSearch() {
			const sortOrder = "&_sort=sortChamber,timestamp&_oder=asc,asc";
			searchModule(2, sortOrder);
			selectedCheckbox.value = [];
		}

		function cancel() {
			form.tool = "Please select tool name";
			form.chartName = "Please select chart name";
			form.startDate = "";
			form.endDate = "";
			selectedCheckbox.value = [];
		}

		function searchModule(searchType, sortOrder) {
			// form is incomplete
			if (!form.tool || !form.chartName) {
				return ErrorToast.fire({
					icon: "error",
					title: "Oops, Please reconfirm your form!",
				});
			}

			const reqDatas = {
				tool: form.tool,
				chartName: form.chartName,
				startTimestamp: new Date(form.startDate).getTime(),
				endTimestamp: new Date(form.endDate).getTime(),
			};

			// if startDate > endDate  exchange
			if (reqDatas.startTimestamp > reqDatas.endTimestamp) {
				[reqDatas.startTimestamp, reqDatas.endTimestamp] = [
					reqDatas.endTimestamp,
					reqDatas.startTimestamp,
				];
			}

			// 有開始日期 沒有結束日期
			if (reqDatas.startTimestamp && !reqDatas.endTimestamp) {
				const axiosConfig =
					"?tool=" +
					reqDatas.tool +
					"&chartName=" +
					reqDatas.chartName +
					"&timestamp_gte=" +
					reqDatas.startTimestamp +
					searchChamberComfig() +
					sortOrder;

				const chartAxiosConfig =
					"?tool=" +
					reqDatas.tool +
					"&chartName=" +
					reqDatas.chartName;

				store.dispatch("initChartAttributes", {
					axiosConfig: chartAxiosConfig,
					chartAttributes: "basic",
				});
				store.dispatch("searchChartDatas", {
					axiosConfig: axiosConfig,
					searchType: searchType,
				});
			}
			// 沒有開始日期 有結束日期
			if (!reqDatas.startTimestamp && reqDatas.endTimestamp) {
				const axiosConfig =
					"?tool=" +
					reqDatas.tool +
					"&chartName=" +
					reqDatas.chartName +
					"&timestamp_lte=" +
					reqDatas.endTimestamp +
					searchChamberComfig() +
					sortOrder;

				const chartAxiosConfig =
					"?tool=" +
					reqDatas.tool +
					"&chartName=" +
					reqDatas.chartName;

				store.dispatch("initChartAttributes", {
					axiosConfig: chartAxiosConfig,
					chartAttributes: "basic",
				});
				store.dispatch("searchChartDatas", {
					axiosConfig: axiosConfig,
					searchType: searchType,
				});
			}
			// 沒有開始日期 沒有結束日期
			if (!reqDatas.startTimestamp && !reqDatas.endTimestamp) {
				const axiosConfig =
					"?tool=" +
					reqDatas.tool +
					"&chartName=" +
					reqDatas.chartName +
					searchChamberComfig() +
					sortOrder;

				console.log("axiosConfig", axiosConfig);
				const chartAxiosConfig =
					"?tool=" +
					reqDatas.tool +
					"&chartName=" +
					reqDatas.chartName;
				console.log("chartAxiosConfig", chartAxiosConfig);
				store.dispatch("initChartAttributes", {
					axiosConfig: chartAxiosConfig,
					chartAttributes: "basic",
				});
				store.dispatch("searchChartDatas", {
					axiosConfig: axiosConfig,
					searchType: searchType,
				});
			}
			// 有開始日期 有結束日期
			if (reqDatas.startTimestamp && reqDatas.endTimestamp) {
				const axiosConfig =
					"?tool=" +
					reqDatas.tool +
					"&chartName=" +
					reqDatas.chartName +
					"&timestamp_gte=" +
					reqDatas.startTimestamp +
					"&timestamp_lte=" +
					reqDatas.endTimestamp +
					searchChamberComfig() +
					sortOrder;

				const chartAxiosConfig =
					"?tool=" +
					reqDatas.tool +
					"&chartName=" +
					reqDatas.chartName;

				store.dispatch("initChartAttributes", {
					axiosConfig: chartAxiosConfig,
					chartAttributes: "basic",
				});
				store.dispatch("searchChartDatas", {
					axiosConfig: axiosConfig,
					searchType: searchType,
				});
			}
		}

		function searchChamberComfig() {
			let searchChamber = "";
			for (let i = 0; i < selectedCheckbox.value.length; i++) {
				searchChamber +=
					"&chamber=%23" + selectedCheckbox.value[i].split("#")[1];
			}
			return searchChamber;
		}

		return {
			toolOptions,
			chartNameOptions,
			checkboxOptions,
			form,
			isCheckAll,
			selectedCheckbox,
			handleInputTool,
			handleInputChartName,
			checkAll,
			updateCheckall,
			search,
			cancel,
			sepecialSearch,
		};
	},
};
</script>
<style lang="scss" scoped>
form {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: calc(100% - 35px);
	width: 100%;
	background-color: #f9ca24;
	color: #0c2461;
	border-radius: 0 0 8px 8px;

	.content {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		width: 90%;
		margin-top: 20px;
		.group {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			width: 100%;
			margin-bottom: 10px;

			span {
				width: 100%;
				font-size: 12px;
				margin-bottom: 2px;
			}

			select {
				width: 100%;
				font-size: 12px;
				padding: 5px 3px;
				border: 1px solid #0c2461;
				background-color: white;
				border-radius: 3px;
				color: #0c2461;
				cursor: pointer;

				&:focus {
					outline: none;
				}
			}

			input:focus {
				outline: none;
			}

			&:nth-child(3),
			&:nth-child(4) {
				width: 50%;

				input[type="date"] {
					height: 15px;
					width: 90%;
					font-size: 12px;
					padding: 3px;
				}
			}

			&:nth-child(5) {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top: 5px;

				span {
					width: 30%;
				}
				.checkbox-aria {
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					height: max-content;
					width: 70%;

					.checkbox {
						display: flex;
						align-items: center;
						margin-right: 10px;
						width: 30px;
						height: 25px;

						input[type="checkbox"] {
							margin-right: 2px;
							cursor: pointer;
						}

						label {
							font-size: 12px;
							color: #0c2461;
							cursor: pointer;
						}
					}
				}
			}
		}
	}

	.btn-group {
		position: absolute;
		bottom: 15px;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		height: max-content;
		width: 100%;

		button {
			border: none;
			border-radius: 6px;
			padding: 5px;
			font-family: "Silkscreen", cursive;
			font-size: 8px;

			cursor: pointer;
			transition: 0.3s;
		}

		.submit-btn {
			color: #f9ca24;
			background-color: #0c2461;
			margin-right: 15px;

			&:hover {
				color: #f9ca24;
				background-color: #3f5897;
			}
		}

		.cancel-btn {
			color: #ffffff;
			background-color: #d63031;

			&:hover {
				color: #0c2461;
				background-color: #ff7675;
			}
		}

		.special-btn {
			width: 55%;
			margin-top: 10px;
			color: #0c2461;
			background-color: #1dd1a1;
			font-size: 12px;
			font-weight: 700;

			&:hover {
				color: #0c2461;
				background-color: #81ecec;
			}
		}
	}
}
</style>
