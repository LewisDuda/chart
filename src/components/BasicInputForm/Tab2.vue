<template>
	<form>
		<div class="content">
			<div class="group">
				<span>Tool Name:</span>
				<select v-model="form.tool" @click="handleInputTool()">
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
				<span>Chart:</span>
				<select v-model="form.chartName">
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
				<span>Date:</span>
				<input type="date" v-model="form.date" />
			</div>
			<div class="group">
				<span>Chamber:</span>
				<input type="text" v-model="form.chamber" />
			</div>
			<div class="group">
				<span>Value:</span>
				<input type="number" v-model="form.value" />
			</div>
		</div>
		<div class="btn-group">
			<button class="submit-btn" type="submit" @click.prevent="submit">
				Submit
			</button>
			<button class="cancel-btn" @click.prevent="cancel">Cancel</button>
		</div>
	</form>
</template>
<script>
import { reactive, computed } from "@vue/runtime-core";
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
			date: "",
			chamber: "#",
			value: null,
		});

		function handleInputTool() {
			form.chartName = "Please select chart name";
			store.dispatch("initChartNameOptions", form.tool);
		}

		async function submit(e) {
			e.preventDefault();
			if (
				!form.tool ||
				!form.chartName ||
				form.chamber === "#" ||
				form.value === null
			) {
				return ErrorToast.fire({
					icon: "error",
					title: "Oops, Please reconfirm your form!",
				});
			}

			if (!form.date) {
				form.date = new Date().toISOString().split("T")[0];
			}
			const formatTimestamp = new Date(form.date).getTime();

			const reqDatas = {
				tool: form.tool,
				chartName: form.chartName,
				date: form.date,
				timestamp: formatTimestamp,
				chamber: form.chamber,
				sortChamber: parseInt(form.chamber.split("#")[1]),
				value: form.value,
			};

			const axiosConfig =
				"?tool=" +
				reqDatas.tool +
				"&chartName=" +
				reqDatas.chartName +
				"&_sort=timestamp,sortChamber&_oder=asc,asc";

			const chartAxiosConfig =
				"?tool=" + reqDatas.tool + "&chartName=" + reqDatas.chartName;

			await store.dispatch("addChartDatas", reqDatas);
			store.dispatch("initChartAttributes", {
				axiosConfig: chartAxiosConfig,
				chartAttributes: "basic",
			});
			store.dispatch("searchChartDatas", {
				axiosConfig: axiosConfig,
				searchType: 1,
			});

			form.tool = reqDatas.tool;
			form.chartName = reqDatas.chartName;
			form.date = reqDatas.date;
			form.chamber = "#";
			form.value = null;
		}

		function cancel() {
			form.tool = "Please select tool name";
			form.chartName = "Please select chart name";
			form.date = "";
			form.chamber = "#";
			form.value = null;
		}

		return {
			toolOptions,
			chartNameOptions,
			form,
			handleInputTool,
			submit,
			cancel,
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
	justify-content: center;
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
		margin-top: -40px;
		.group {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			width: 100%;
			margin-bottom: 40px;

			span {
				width: 30%;
				font-size: 12px;
				margin-bottom: 5px;
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

			&:nth-child(3) {
				display: flex;
				flex-direction: column;
				width: 45%;
				margin-bottom: 0;

				span {
					width: 100%;
				}
				input {
					width: 90%;
					height: 20px;
				}
			}
			&:nth-child(4),
			&:nth-child(5) {
				display: flex;
				flex-direction: column;
				margin-bottom: 0;

				span {
					width: 100%;
				}
				input {
					width: 75%;
					height: 20px;
				}
			}
			&:nth-child(4) {
				justify-content: center;
				align-items: flex-start;
				margin: 0 -5px 0 15px;
				width: 25%;
			}
			&:nth-child(5) {
				text-align: center;
				justify-content: flex-end;
				align-items: flex-end;
				width: 25%;
			}
		}
	}

	.btn-group {
		position: absolute;
		bottom: 15px;
		display: flex;
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
			margin-right: 30px;

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
	}
}
</style>
