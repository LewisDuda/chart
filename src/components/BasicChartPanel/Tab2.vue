<template>
	<form action="">
		<div class="content">
			<div class="group">
				<span>Chart-Title:</span>
				<input type="number" v-model="form.chartTitleSize" />
			</div>
			<div class="group">
				<span>Y-Title:</span>
				<input type="number" v-model="form.yTitleSize" />
			</div>
			<div class="group">
				<span>X-Label:</span>
				<input type="number" v-model="form.xLabelSize" />
			</div>
			<div class="group">
				<span>X-SubLabel:</span>
				<input type="number" v-model="form.xSubLabelSize" />
			</div>
			<div class="group">
				<span>Y-Label:</span>
				<input type="number" v-model="form.yLabelSize" />
			</div>
		</div>
	</form>
</template>
<script>
    import { computed } from "@vue/runtime-core";
    import store from "../../store/index.js";
    export default {
        setup() {
            const form = computed(() => store.state.basicChartDetail);
            return {
                form,
            };
        },
    };
</script>
<style lang="scss" scoped>
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: calc(100% - 35px);
        width: 100%;
        box-sizing: border-box;
        border-radius: 0 0 8px 8px;
        background-color: #f9ca24;
        color: #0c2461;

        .content {
            display: flex;
            flex-wrap: wrap;
            width: 90%;
            height: 60%;
            .group {
                display: flex;
                align-items: center;
                justify-content: center;
                height: max-content;
                width: 50%;

                span {
                    height: max-content;
                    width: 70px;
                    padding: 2px;
                    font-size: 12px;
                }

                input {
                    height: 15px;
                    width: 50px;
                    padding: 2px;
                    font-size: 12px;
                    border: 1px solid #0c2461;
                    border-radius: 3px;
                    color: #0c2461;

                    &:focus {
                        outline: none;
                    }
                }
            }
        }
    }
</style>
