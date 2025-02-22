import {Method, Mikrotik} from "@/lib/types";

export function gateway(address: string): string {
  const [ip, cidr] = address.split('/')

  if (cidr === '32') return ip

  const ipParts = ip.split('.').map(Number)
  const mask = 0xFFFFFFFF << (32 - Number(cidr)) >>> 0
  const maskParts = [(mask >>> 24) & 0xFF, (mask >>> 16) & 0xFF, (mask >>> 8) & 0xFF, mask & 0xFF,]

  const networkParts = ipParts.map((part, index) => part & maskParts[index])
  networkParts[3] += 1;
  return networkParts.join('.')
}

export function cmd(mikrotik: Mikrotik, method: Method, params: Record<string, string>) {
  const patch = mikrotik.split(' ').join('/')
  const args = Object.entries(params).map(([key, value]) => `${key}=${value}`).join(' ')
  return `/${patch} ${method} ${args}`
}
