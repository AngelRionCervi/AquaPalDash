import type { Route } from "../components/Navigation/types";

const menuRoutes: Array<Route> = [
	{ "id": "home", "label": "Home", "route": "/home" },
	{ "id": "monitoring", "label": "Monitoring", "route": "/monitoring" },
	{ "id": "devices", "label": "Devices", "route": "/devices" },
	{ "id": "settings", "label": "Settings", "route": "/settings" }
]

export default menuRoutes;
