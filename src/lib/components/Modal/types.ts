export type ModalTypes =
  | 'scheduleSetting'
  | 'buttonSlotSetting'
  | 'removeDevices'
  | 'addDevice'
  | 'modifyDevice'
  | 'login'
  | 'wifiSetup'
  | 'warningWifiReset'
  | 'modifyPassword'
  | 'wifiSetupLogin'
  | 'wsServerSetup'
  | 'phCalibration';

export type ModalSpecs = {
  [key in ModalTypes]: {
    title: string;
    isStatic?: boolean;
    variant?: 'warning';
  };
};
