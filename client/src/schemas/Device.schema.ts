export interface DeviceType {
  _id?: string;
  created_at?: Date;
  updated_at?: Date;
  uAParse?: {
    deviceUAParse_name: string;
    deviceUAParse_cpu_architecture: string;
    deviceUAParse_engine_name: string;
    deviceUAParse_engine_version: string;
    deviceUAParse_os_name: string;
    deviceUAParse_os_version: string;
    deviceUAParse_ua: string;
    deviceUAParse_version: string;
  };
  device?: {
    hostname: string;
    platform: string;
    cpuInfo: ObjectConstructor[][];
    fileInfo: number;
    networkInfo: {
      Ethernet: ArrayConstructor[];
      "Loopback Pseudo-Interface 1": ArrayConstructor[];
      "Teredo Tunneling Pseudo-Interface": ArrayConstructor[];
    };
    osType: string;
    osPlatform: string;
    osArch: string;
    userInfo: {
      uid: number;
      gid: number;
      username: string;
      homedir: string;
      shell: null;
    };

    totalMemory: number;
    freeMemory: number;
    uptime: number;
    osConstants: {
      UV_UDP_REUSEADDR: number;
      dlopen: object;
      errno: ObjectConstructor[];
      signals: ObjectConstructor[];
      priority: ObjectConstructor[];
    };
    is64Bit: boolean;
    loadAvg: number[];
    isLittleEndian: boolean;
  };
}
export default class Device {
  _id: string;
  created_at: Date;
  updated_at: Date;
  uAParse: {
    deviceUAParse_name: string;
    deviceUAParse_cpu_architecture: string;
    deviceUAParse_engine_name: string;
    deviceUAParse_engine_version: string;
    deviceUAParse_os_name: string;
    deviceUAParse_os_version: string;
    deviceUAParse_ua: string;
    deviceUAParse_version: string;
  };
  device: {
    hostname: string;
    platform: string;
    cpuInfo: ObjectConstructor[][];
    fileInfo: number;
    networkInfo: {
      Ethernet: ArrayConstructor[];
      "Loopback Pseudo-Interface 1": ArrayConstructor[];
      "Teredo Tunneling Pseudo-Interface": ArrayConstructor[];
    };
    osType: string;
    osPlatform: string;
    osArch: string;
    userInfo: {
      uid: number;
      gid: number;
      username: string;
      homedir: string;
      shell: null;
    };

    totalMemory: number;
    freeMemory: number;
    uptime: number;
    osConstants: {
      UV_UDP_REUSEADDR: number;
      dlopen: object;
      errno: ObjectConstructor[];
      signals: ObjectConstructor[];
      priority: ObjectConstructor[];
    };
    is64Bit: boolean;
    loadAvg: number[];
    isLittleEndian: boolean;
  };

  constructor({ _id, created_at, updated_at, uAParse, device }: DeviceType) {
    const date = new Date();
    this._id = _id || "";
    this.created_at = created_at || date;
    this.updated_at = updated_at || date;
    //
    this.uAParse = {
      deviceUAParse_name: (uAParse && uAParse.deviceUAParse_name) || "",
      deviceUAParse_cpu_architecture:
        (uAParse && uAParse.deviceUAParse_cpu_architecture) || "",
      deviceUAParse_engine_name:
        (uAParse && uAParse.deviceUAParse_engine_name) || "",
      deviceUAParse_engine_version:
        (uAParse && uAParse.deviceUAParse_engine_version) || "",
      deviceUAParse_os_name: (uAParse && uAParse.deviceUAParse_os_name) || "",
      deviceUAParse_os_version:
        (uAParse && uAParse.deviceUAParse_os_version) || "",
      deviceUAParse_ua: (uAParse && uAParse.deviceUAParse_ua) || "",
      deviceUAParse_version: (uAParse && uAParse.deviceUAParse_version) || "",
    };
    this.device = {
      hostname: (device && device.hostname) || "",
      platform: (device && device.platform) || "",
      cpuInfo: (device && device.cpuInfo) || [],
      fileInfo: (device && device.fileInfo) || 0,
      networkInfo: {
        Ethernet: (device && device.networkInfo.Ethernet) || [],
        "Loopback Pseudo-Interface 1":
          (device && device.networkInfo["Loopback Pseudo-Interface 1"]) || [],
        "Teredo Tunneling Pseudo-Interface":
          (device && device.networkInfo["Teredo Tunneling Pseudo-Interface"]) ||
          [],
      },
      osType: (device && device.osType) || "",
      osPlatform: (device && device.osPlatform) || "",
      osArch: (device && device.osArch) || "",
      userInfo: {
        uid: (device && device.userInfo.uid) || 0,
        gid: (device && device.userInfo.gid) || 0,
        username: (device && device.userInfo.username) || "",
        homedir: (device && device.userInfo.homedir) || "",
        shell: (device && device.userInfo.shell) || null,
      },
      totalMemory: (device && device.totalMemory) || 0,
      freeMemory: (device && device.freeMemory) || 0,
      uptime: (device && device.uptime) || 0,
      osConstants: {
        UV_UDP_REUSEADDR: (device && device.osConstants.UV_UDP_REUSEADDR) || 0,
        dlopen: (device && device.osConstants.dlopen) || {},
        errno: (device && device.osConstants.errno) || [],
        signals: (device && device.osConstants.signals) || [],
        priority: (device && device.osConstants.priority) || [],
      },
      is64Bit: (device && device.is64Bit) || false,
      loadAvg: (device && device.loadAvg) || [],
      isLittleEndian: (device && device.isLittleEndian) || false,
    };
  }
}
