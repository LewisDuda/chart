<script>
    import { ref, reactive, computed } from "@vue/runtime-core";
    import Tab1 from "./Tab1.vue";
    import Tab2 from "./Tab2.vue";
    import Tab3 from "./Tab3.vue";
    import Tab4 from "./Tab4.vue";

    export default {
        components: {
            Tab1,
            Tab2,
            Tab3,
            Tab4,
        },
        setup() {
            const tabs = reactive([
                "Key In\n\rChart",
                "Key In\n\Data",
                "Search\n\rChart",
                "Delete\n\rChart",
            ]);
            const activeTab = ref("Key In\n\rChart");
            const currentTabComponent = computed(() => {
                if (activeTab.value === "Key In\n\rChart") return Tab1;
                if (activeTab.value === "Key In\n\Data") return Tab2;
                if (activeTab.value === "Search\n\rChart") return Tab3;
                if (activeTab.value === "Delete\n\rChart") return Tab4;
            });

            return {
                tabs,
                activeTab,
                currentTabComponent,
            };
        },
    };
</script>
<template src="./template.html"></template>
<style src="./style.scss" scoped></style>
