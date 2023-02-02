<template>
	<form action="">
		<div class="content">
			<div class="group">
				<span>Tool Name:</span>
				<input
					type="text"
					v-model="form.tool"
					placeholder="Please input tool name..."
				/>
			</div>
			<div class="group">
				<span>Chart Name:</span>
				<input
					type="text"
					v-model="form.chartName"
					placeholder="Please input chart name..."
				/>
			</div>
			<div class="group">
				<span>Y Title:</span>
				<input
					type="text"
					v-model="form.yAxialTitle"
					placeholder="Please input y title..."
				/>
			</div>
			<div class="group">
				<span>MaxSpec:</span>
				<input type="number" v-model="form.maxSpec" />
			</div>
			<div class="group">
				<span>MinSpec:</span>
				<input type="number" v-model="form.minSpec" />
			</div>
			<div class="group">
				<span>Target:</span>
				<input type="number" v-model="form.target" />
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
import { reactive } from "@vue/runtime-core";
import store from "../../store/index.js";
import Swal from "sweetalert2";
import chartAttributesAPIs from "../../api/chartAttributes.js";

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
		const form = reactive({
			tool: "",
			chartName: "",
			yAxialTitle: "",
			maxSpec: null,
			minSpec: null,
			target: null,
			max: 100,
			min: 0,
		});

		async function submit() {
			if (
				!form.tool ||
				!form.chartName ||
				!form.yAxialTitle ||
				form.maxSpec === null ||
				form.minSpec === null ||
				form.target === null
			) {
				return ErrorToast.fire({
					icon: "error",
					title: "Oops, Please reconfirm your form!",
				});
			}

			// Check tool with chart isDuplicate?
			const axiosConfig =
				"?tool=" + form.tool + "&chartName=" + form.chartName;
			const checkRes =
				await chartAttributesAPIs.CHECK_TOOL_CHARTNAME_DUPLICATE(
					axiosConfig
				);
			const { status, duplicate } = checkRes;

			if (duplicate) {
				return ErrorToast.fire({
					icon: "error",
					title: "Oops, tool with chart duplicate!",
				});
			}

			if (status === 404) {
				return ErrorToast.fire({
					icon: "error",
					title: "Oops, Add chartAttributes fail!",
				});
			}

			store.dispatch("addChartAttributes", form);

			form.tool = "";
			form.chartName = "";
			form.yAxialTitle = "";
			form.maxSpec = null;
			form.minSpec = null;
			form.target = null;
			store.dispatch("initToolOptions");
		}

		function cancel() {
			form.tool = "";
			form.chartName = "";
			form.yAxialTitle = "";
			form.maxSpec = null;
			form.minSpec = null;
			form.target = null;
		}

		return {
			form,
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
	box-sizing: border-box;
	background-color: #f9ca24;
	color: #0c2461;
	border-radius: 0 0 8px 8px;

	.content {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		width: 90%;
		.group {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			width: 98%;
			margin-bottom: 30px;

			span {
				width: 100%;
				font-size: 12px;
				margin-bottom: 5px;
			}

			input {
				width: 100%;
				font-size: 12px;
				padding: 5px 3px;
				border: 1px solid #0c2461;
				background-color: white;
				border-radius: 3px;
				color: #0c2461;

				&:focus {
					outline: none;
				}
			}

			&:nth-child(4),
			&:nth-child(5),
			&:nth-child(6) {
				display: flex;
				flex-direction: column;
				width: 33%;

				span {
					width: 55%;
				}
				input {
					width: 50%;
					padding: 3px;
				}
			}

			&:nth-child(4) {
				align-items: flex-start;
			}

			&:nth-child(5) {
				align-items: center;
				justify-content: center;
			}
			&:nth-child(6) {
				align-items: flex-end;
				justify-content: center;
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
			font-size: 12px;
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
