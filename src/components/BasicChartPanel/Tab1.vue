<template>
	<form action="">
		<div class="content">
			<div class="group">
				<span>Max:</span>
				<input type="number" v-model="form.max" />
			</div>
			<div class="group">
				<span>Min:</span>
				<input type="number" v-model="form.min" />
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
			<div class="group">
				<span>TickSteps:</span>
				<input type="number" v-model="form.ticksSteps" />
			</div>
			<div class="group">
				<span>ShowLegend:</span>
				<input type="checkbox" v-model="form.isShowLegend" />
			</div>
			<div class="break-line-group">
				<div class="input-area">
					<span>BreakLine:</span>
					<input
						type="number"
						v-model="breakLineInput"
						@keyup.enter="handleAdd"
					/>
				</div>
				<div class="table-area">
					<div
						class="item"
						v-for="(item, index) in breakLine"
						:key="index"
					>
						<span> {{ item }} </span>
						<i
							class="fa-sharp fa-solid fa-circle-minus"
							@click="handleDelete(index)"
						></i>
					</div>
				</div>
			</div>
		</div>
	</form>
</template>
<script>
    import { ref, computed } from "@vue/runtime-core";
    import store from "../../store/index.js";
    export default {
        setup() {
            const form = computed(() => store.state.basicChartDetail);
            const breakLineInput = ref(null);
            const breakLine = computed(
                () => store.state.basicChartDetail.breakLine
            );

            function handleAdd() {
                const handleType = "Add";
                store.commit("MODIFY_BREAK_LINE", {
                    type: "basic",
                    handleType: handleType,
                    item: breakLineInput.value,
                });
                breakLineInput.value = "";
            }

            function handleDelete(index) {
                const handleType = "Delete";
                store.commit("MODIFY_BREAK_LINE", {
                    type: "basic",
                    handleType: handleType,
                    index: index,
                });
            }

            return {
                form,
                breakLineInput,
                breakLine,
                handleAdd,
                handleDelete,
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
                justify-content: flex-start;
                height: max-content;
                width: 50%;
                margin-bottom: 15px;

                span {
                    height: max-content;
                    width: 80px;
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
            .break-line-group {
                display: flex;
                width: 100%;
                height: 80px;
                margin-top: 10px;
                padding-left: 2px;

                .input-area {
                    display: flex;
                    width: 50%;
                    height: 100%;
                    padding-top: 3px;

                    span {
                        height: max-content;
                        width: 75px;
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

                .table-area {
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    align-items: center;
                    width: 50%;
                    height: 100%;

                    .item {
                        display: flex;
                        align-items: center;
                        width: max-content;
                        margin-bottom: 3px;

                        span {
                            width: 35px;
                        }

                        i {
                            cursor: pointer;
                            transition: 0.3s;

                            &:hover {
                                color: red;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
