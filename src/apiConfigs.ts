import { networkInterfaces } from 'os';

export function getLocalIP() {
  const interfaces = networkInterfaces();
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName] as any;
    console.log(interfaceInfo);
    for (const info of interfaceInfo) {
      if (!info.internal && info.family === 'IPv4') {
        return info.address;
      }
    }
  }
  return 'localhost'; // Fallback if IP address not found
}
