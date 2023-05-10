import { createRouter, createWebHashHistory } from "vue-router";
const Home = () => import("../App.vue");
const routes = [
	{
		path: "/",
		component: Home,
	},
];

const router = createRouter({
	routes,
	history: createWebHashHistory(),
});

export default router;
