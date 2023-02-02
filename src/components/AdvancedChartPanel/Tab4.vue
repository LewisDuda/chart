<template>
	<form action="">
		<div class="content">
			<div class="group">
				<span>Line-Width:</span>
				<input type="number" v-model="form.lineWidth" />
			</div>
			<div class="group">
				<span>Point-Radius:</span>
				<input type="number" v-model="form.pointRadius" />
			</div>
			<div class="group">
				<span>Line-Radian:</span>
				<input type="number" step="0.01" v-model="form.lineRadian" />
			</div>
			<div class="group">
				<span>xSubLabelAngle:</span>
				<input type="number" v-model="form.xSubLabelAngle" />
			</div>
			<div class="group">
				<span>ShowXSubLabel:</span>
				<input type="checkbox" v-model="form.isShowXSubLabel" />
			</div>
		</div>
	</form>
</template>
<script>
    import { computed } from "@vue/runtime-core";
    import store from "../../store/index.js";
    export default {
        setup() {
            const form = computed(() => store.state.advancedChartDetail);
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
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                height: max-content;
                width: 50%;

                span {
                    height: max-content;
                    font-size: 12px;
                    margin-bottom: 10px;
                }

                input {
                    height: 15px;
                    width: 50px;
                    padding: 3px;
                    font-size: 12px;
                    border: 1px solid #0c2461;
                    border-radius: 3px;
                    color: #0c2461;

                    &:focus {
                        outline: none;
                    }
                }

                &:nth-child(5) {
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;

                    span {
                        margin: 0 15px 0 50px;
                    }
                }
            }
        }
    }
</style>
