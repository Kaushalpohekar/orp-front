import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        routeLink: 'overview',
        icon: 'home',
        label: 'Overview',
        UserType:'Admin',
    },
    {
        routeLink: 'analysis',
        icon: 'analytics',
        label: 'Analysis',
        UserType:'Admin',
    },
    {
        routeLink: 'settings',
        icon: 'settings',
        label: 'Settings',
        UserType:'Standard',
    },
    {
        routeLink: 'report',
        icon: 'cloud',
        label: 'Report',
        UserType:'Admin',
    },
];