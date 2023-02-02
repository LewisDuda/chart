<script setup>
    import { ref, reactive, computed } from "@vue/runtime-core";
    import store from "../../store";

    const toolOptions = computed(() => store.state.toolOptions);
    const chartNameOptions = computed(() => store.state.chartNameOptions);
    const isCheckAll = ref(false);
    const selectedCheckbox = ref([]);
    const checkboxOptions = computed(() => store.state.chamberOptions);
    const form = reactive({
        tool: "Please select tool name",
        chartName: "Please select chart name",
        startDate: "",
        endDate: "",
        chamber: "#",
    });

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
        if (selectedCheckbox.value.length === checkboxOptions.value.length) {
            isCheckAll.value = true;
        } else {
            isCheckAll.value = false;
        }
    }

    async function handlePreSearch() {
        let showChamber = "";
        for (let i = 0; i < selectedCheckbox.value.length; i++) {
            showChamber += selectedCheckbox.value[i] + ",";
        }

        if (form.startDate > form.endDate) {
            [form.startDate, form.endDate] = [form.endDate, form.startDate];
        }

        const data = {
            tool: form.tool,
            chartName: form.chartName,
            startDate: form.startDate,
            endDate: form.endDate,
            showChamber: showChamber,
            chamber: selectedCheckbox.value,
        };

        await store.dispatch("addPreSelection", data);
        selectedCheckbox.value = [];
        isCheckAll.value = false;
    }
</script>
<template src="./template.html"></template>
<style scoped lang="scss" src="./style.scss"></style>
