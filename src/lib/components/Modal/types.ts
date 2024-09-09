export type ModalTypes = 'scheduleSetting' | 'buttonSlotSetting' | 'removeDevices' | 'addDevice' | 'modifyDevice' | 'login' | 'wifiSetup' | 'warningWifiReset';

export type ModalSpecs = {
    [key in ModalTypes]: {
        title: string;
        isStatic?: boolean;
        variant?: 'warning'
    }
}
