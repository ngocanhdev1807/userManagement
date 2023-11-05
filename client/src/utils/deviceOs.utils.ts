import os from "os";

class DeviceOs {
  public result = () => {
    return {
      os: {
        hostname: os.hostname(),
        platform: os.platform(),
        cpuInfo: os.cpus(),
        fileInfo: os.freemem(),
        networkInfo: os.networkInterfaces(),
        osType: os.type(),
        osPlatform: os.platform(),
        osArch: os.arch(),
        userInfo: os.userInfo(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        uptime: os.uptime(),
        osConstants: os.constants,
        is64Bit: os.arch() === "x64",
        loadAvg: os.loadavg(),
        isLittleEndian: os.endianness() === "LE",
      },
    };
  };
}

const deviceOs = new DeviceOs();
export default deviceOs;
