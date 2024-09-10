export type ModalTypes =
  | 'scheduleSetting'
  | 'buttonSlotSetting'
  | 'removeDevices'
  | 'addDevice'
  | 'modifyDevice'
  | 'login'
  | 'wifiSetup'
  | 'warningWifiReset'
  | 'modifyPassword';

export type ModalSpecs = {
  [key in ModalTypes]: {
    title: string;
    isStatic?: boolean;
    variant?: 'warning';
  };
};
