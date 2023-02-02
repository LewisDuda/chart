<script>
    import { ref, computed } from "@vue/runtime-core";
    import store from "../../store";
    import Swal from "sweetalert2";
    import * as XLSX from "xlsx";

    export default {
        directives: {
            focus: {
                mounted(el) {
                    el.focus();
                },
            },
        },
        setup() {
            const items = computed(() => store.state.basicItems);
            const edit = ref("");
            const tableDates = computed(() => {
                if (store.state.searchType === 1) {
                    return store.getters.datesGrouping;
                } else {
                    return store.getters.chambersGrouping;
                }
            });
            const processItems = computed(() => store.getters.processBasicItems);
            const chartTitle = computed(
                () =>
                    store.state.basicChartAttributes.tool +
                    "_" +
                    store.state.basicChartAttributes.chartName
            );

            // Edit Chamber
            function handleEditChamber(item) {
                items.value[item.index].isChamberEdit = true;
                edit.value = items.value[item.index].chamber;
            }

            function submitEditChamber(item) {
                const updateData = {
                    chamber: edit.value,
                    sortChamber: parseInt(edit.value.split("#")[1]),
                };

                store.dispatch("editChartData", {
                    id: item.id,
                    index: item.index,
                    updateData: updateData,
                });
            }

            function cancelEditChamber(item) {
                items.value[item.index].isChamberEdit = false;
                edit.value = "";
            }

            // Edit Value
            function handleEditValue(item) {
                items.value[item.index].isValueEdit = true;
                edit.value = items.value[item.index].value;
            }

            function submitEditValue(item) {
                const updateData = {
                    value: edit.value,
                };

                store.dispatch("editChartData", {
                    id: item.id,
                    index: item.index,
                    updateData: updateData,
                });
            }

            function cancelEditValue(item) {
                items.value[item.index].isValueEdit = false;
                edit.value = "";
            }

            // Delete Data
            function handleDelete(item) {
                const deleteText =
                    "You wont to delete" +
                    " Date: " +
                    item.date +
                    " Chamber: " +
                    item.chamber +
                    " Value: " +
                    item.value;
                Swal.fire({
                    title: "Are you sure?",
                    text: deleteText,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d63031",
                    cancelButtonColor: "#ccc",
                    confirmButtonText: "Yes, delete it!",
                }).then((result) => {
                    if (result.isConfirmed) {
                        store.dispatch("deleteChartData", {
                            id: item.id,
                            index: item.index,
                        });
                    }
                });
            }

            function download() {
                const date = new Date().toISOString().split("T")[0].split("-");
                let dataTransform = [];

                for (let i = 0; i < items.value.length; i++) {
                    dataTransform[i] = {
                        Date: items.value[i].date,
                        Chamber: items.value[i].chamber,
                        Value: items.value[i].value,
                    };
                }

                const data = XLSX.utils.json_to_sheet(dataTransform);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, data, date[0] + date[1] + date[2]);
                XLSX.writeFile(wb, date[0] + date[1] + date[2] + ".xlsx");
            }

            return {
                chartTitle,
                items,
                edit,
                tableDates,
                processItems,
                handleEditChamber,
                submitEditChamber,
                cancelEditChamber,
                handleEditValue,
                submitEditValue,
                cancelEditValue,
                handleDelete,
                download,
            };
        },
    };
</script>
<template src="./template.html"></template>
<style src="./style.scss" lang="scss" scoped></style>
