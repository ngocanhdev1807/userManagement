import axios from "axios";
import { UAParser } from "ua-parser-js";

class DeviceUAParser {
  public result = () => {
    return {
      uAParser: {
        name: UAParser().browser.name,
        version: UAParser().browser.version,
        cpu: UAParser().cpu,
        engine: UAParser().engine,
        os: UAParser().os,
        ua: UAParser().ua,
      },
    };
  };
}

const deviceUAParse = new DeviceUAParser();
export default deviceUAParse;
