<script>
    import { ref, reactive, computed } from "@vue/runtime-core";
    import Tab1 from "./Tab1.vue";
    import Tab2 from "./Tab2.vue";
    import Tab3 from "./Tab3.vue";
    import Tab4 from "./Tab4.vue";
    export default {
        components: {
            Tab1,
        },
        setup() {
            const tabs = reactive([
                "Attribute",
                "Font\n\rSize",
                "Font\n\rWeight",
                "Decorate",
            ]);
            const activeTab = ref("Attribute");
            const currentTabComponent = computed(() => {
                if (activeTab.value === "Attribute") return Tab1;
                if (activeTab.value === "Font\n\rSize") return Tab2;
                if (activeTab.value === "Font\n\rWeight") return Tab3;
                if (activeTab.value === "Decorate") return Tab4;
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
