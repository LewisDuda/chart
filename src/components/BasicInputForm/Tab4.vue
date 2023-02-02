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
		</div>
		<div class="btn-group">
			<button class="submit-btn" type="submit" @click="confirm">
				Delete
			</button>
			<button class="cancel-btn" @click.prevent="cancel">Cancel</button>
		</div>
	</form>
</template>
<script>
import { reactive, computed } from "@vue/runtime-core";
import store from "../../store/index.js";

export default {
	setup() {
		const form = reactive({
			tool: "Please select tool name",
			chartName: "Please select chart name",
		});
		const toolOptions = computed(() => store.state.toolOptions);
		const chartNameOptions = computed(() => store.state.chartNameOptions);

		function handleInputTool() {
			chartNameOptions.value = [];
			form.chartName = "Please select chart name";
			store.dispatch("initChartNameOptions", form.tool);
		}

		function confirm() {
			const axiosConfig =
				"?tool=" + form.tool + "&chartName=" + form.chartName;

			store.dispatch("deletChart", axiosConfig);
		}

		function cancel() {
			form.tool = "Please select tool name";
			form.chartName = "Please select chart name";
		}

		return {
			form,
			toolOptions,
			chartNameOptions,
			handleInputTool,
			confirm,
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
		margin-top: 100px;
		.group {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			width: 100%;
			margin-bottom: 25px;

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
			color: #ffffff;
			background-color: #d63031;
			margin-right: 30px;

			&:hover {
				color: #0c2461;
				background-color: #ff7675;
			}
		}

		.cancel-btn {
			color: #0c2461;
			background-color: #a4b0be;

			&:hover {
				color: #0c2461;
				background-color: #dfe4ea;
			}
		}
	}
}
</style>
