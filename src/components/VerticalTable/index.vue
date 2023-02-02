<script setup>
    import { reactive, computed } from "@vue/runtime-core";
    import store from "../../store";
    import chartAPIs from "../../api/chart.js";

    const advancedSelected = computed(() => store.state.advancedSelected);
    const advancedItems = computed(() => store.state.advancedItems);
    const searchResArr = reactive([]);

    function deleteAllAdvancedSelected() {
        store.dispatch("deletePreSelection", "all");
    }

    function deleteAdvancedSelected(key) {
        store.dispatch("deletePreSelection", key);
    }

    async function search() {
        advancedItems.value = [];

        for (let i = 0; i < advancedSelected.value.length; i++) {
            let axiosConfig = "";
            let selectedItem = advancedSelected.value[i];
            let startTimestamp = new Date(selectedItem.startDate).getTime();
            let endTimestamp = new Date(selectedItem.endDate).getTime();

            // 有開始日期 沒有結束日期
            if (startTimestamp && !endTimestamp) {
                axiosConfig =
                    "?tool=" +
                    advancedSelected.value[i].tool +
                    "&chartName=" +
                    advancedSelected.value[i].chartName +
                    "&timestamp_gte=" +
                    startTimestamp +
                    searchChamberComfig(i) +
                    "&_sort=timestamp,sortChamber&_oder=asc,asc";

                const res = await chartAPIs.GET_CHART_DATAS(axiosConfig);
                const { status, data } = res;

                if (status === 404) {
                    return ErrorToast.fire({
                        icon: "error",
                        title: "Search chart datas fail!",
                    });
                }
                searchResArr.push(data);
            }
            // 沒有開始日期 有結束日期
            if (!startTimestamp && endTimestamp) {
                axiosConfig =
                    "?tool=" +
                    advancedSelected.value[i].tool +
                    "&chartName=" +
                    advancedSelected.value[i].chartName +
                    "&timestamp_lte=" +
                    endTimestamp +
                    searchChamberComfig(i) +
                    "&_sort=timestamp,sortChamber&_oder=asc,asc";

                const res = await chartAPIs.GET_CHART_DATAS(axiosConfig);
                const { status, data } = res;

                if (status === 404) {
                    return ErrorToast.fire({
                        icon: "error",
                        title: "Search chart datas fail!",
                    });
                }
                searchResArr.push(data);
            }
            // 沒有開始日期 沒有結束日期
            if (!startTimestamp && !endTimestamp) {
                axiosConfig =
                    "?tool=" +
                    advancedSelected.value[i].tool +
                    "&chartName=" +
                    advancedSelected.value[i].chartName +
                    searchChamberComfig(i) +
                    "&_sort=timestamp,sortChamber&_oder=asc,asc";

                const res = await chartAPIs.GET_CHART_DATAS(axiosConfig);
                const { status, data } = res;

                if (status === 404) {
                    return ErrorToast.fire({
                        icon: "error",
                        title: "Search chart datas fail!",
                    });
                }
                searchResArr.push(data);
            }
            // 有開始日期 有結束日期
            if (startTimestamp && endTimestamp) {
                axiosConfig =
                    "?tool=" +
                    advancedSelected.value[i].tool +
                    "&chartName=" +
                    advancedSelected.value[i].chartName +
                    "&timestamp_gte=" +
                    startTimestamp +
                    "&timestamp_lte=" +
                    endTimestamp +
                    searchChamberComfig(i) +
                    "&_sort=timestamp,sortChamber&_oder=asc,asc";

                const res = await chartAPIs.GET_CHART_DATAS(axiosConfig);
                const { status, data } = res;

                if (status === 404) {
                    return ErrorToast.fire({
                        icon: "error",
                        title: "Search chart datas fail!",
                    });
                }
                searchResArr.push(data);
            }
            store.commit("INIT_ADVANCED_CHART_DATAS", searchResArr);
        }
    }

    function searchChamberComfig(i) {
        let searchChamber = "";

        for (let j = 0; j < advancedSelected.value[i].chamber.length; j++) {
            searchChamber +=
                "&chamber=%23" + advancedSelected.value[i].chamber[j].split("#")[1];
        }
        return searchChamber;
    }
</script>
<template src="./template.html"></template>
<style scoped lang="scss" src="./style.scss"></style>
