<script setup>
import BasicInputForm from "./components/BasicInputForm/index.vue";
import HorizontalTable from "./components/HorizontalTable/index.vue";
import BasicChartPanel from "./components/BasicChartPanel/index.vue";
import BasicChart from "./components/BasicChart/index.vue";
import AdvancedInputForm from "./components/AdvancedInputForm/index.vue";
import VerticalTable from "./components/VerticalTable/index.vue";
import AdvancedChartPanel from "./components/AdvancedChartPanel/index.vue";
import AdvancedChart from "./components/AdvancedChart/index.vue";

import { computed } from "@vue/runtime-core";
import store from "./store";

const isBasicTableLoding = computed(() => {
	if (store.state.basicItems.length === 0) {
		return true;
	} else {
		return false;
	}
});
const isBasicChartLoding = computed(() => {
	if (store.state.basicItems.length === 0) {
		return true;
	} else {
		return false;
	}
});
const isAdvancedTableLoding = computed(() => {
	if (store.state.advancedSelected.length === 0) {
		return true;
	} else {
		return false;
	}
});
const isAdvancedChartLoding = computed(() => {
	if (store.state.advancedItems.length === 0) {
		return true;
	} else {
		return false;
	}
});

store.dispatch("initToolOptions");
store.dispatch("start_init");
</script>

<template>
	<div id="select-section">
		<a href="#section1">Basic Table</a> |
		<a href="#section2">Basic Chart</a> |
		<a href="#section3">Advanced Table</a> |
		<a href="#section4">Advanced Chart</a>
	</div>
	<div id="section1">
		<div class="input-form">
			<BasicInputForm />
		</div>
		<div class="table">
			<h3 class="loding-text" v-if="isBasicTableLoding">No Data</h3>
			<HorizontalTable v-else />
		</div>
	</div>
	<div id="section2">
		<label class="menu-btn" for="basic-switch-btn"
			><i class="fa-solid fa-burger"></i
		></label>
		<input
			type="checkbox"
			name=""
			id="basic-switch-btn"
			class="switch-btn"
		/>
		<div class="input-form">
			<BasicChartPanel />
		</div>
		<h3 class="loding-text" v-show="isBasicChartLoding">No Data</h3>
		<BasicChart v-show="!isBasicChartLoding" />
	</div>
	<div id="section3">
		<AdvancedInputForm />
		<div class="table">
			<h3 class="loding-text" v-if="isAdvancedTableLoding">No Data</h3>
			<VerticalTable v-else />
		</div>
	</div>
	<div id="section4">
		<label class="menu-btn" for="advanced-switch-btn"
			><i class="fa-solid fa-burger"></i
		></label>
		<input
			type="checkbox"
			name=""
			id="advanced-switch-btn"
			class="switch-btn"
		/>
		<div class="input-form">
			<AdvancedChartPanel />
		</div>
		<h3 class="loding-text" v-show="isAdvancedChartLoding">No Data</h3>
		<AdvancedChart v-show="!isAdvancedChartLoding" />
	</div>
	<div class="footer">Copyright &copy; Lewis 2022.</div>
</template>
