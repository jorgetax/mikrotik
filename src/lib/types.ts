export enum Mikrotik {
  INTERFACE = 'interface',
  INTERFACE_LIST = 'interface list',
  INTERFACE_LIST_MEMBER = 'interface list member',
  INTERFACE_BRIDGE = 'interface bridge',
  INTERFACE_BRIDGE_PORT = 'interface bridge port',
  IP = 'ip',
  IP_DNS = 'ip dns',
  IP_ADDRESS = 'ip address',
  IP_ROUTE = 'ip route',
  IP_POOL = 'ip pool',
  IP_DHCP_SERVER = 'ip dhcp-server',
  IP_DHCP_SERVER_NETWORK = 'ip dhcp-server network',
  IP_FIREWALL = 'ip firewall',
  IP_FIREWALL_FILTER = 'ip firewall filter',
  IP_FIREWALL_NAT = 'ip firewall nat',
  IP_FIREWALL_MANGLE = 'ip firewall mangle',
  IP_FIREWALL_ADDRESS_LIST = 'ip firewall address-list',
  SYSTEM = 'system',
  SYSTEM_IDENTITY = 'system identity',
}

export enum Method {
  ADD = 'add',
  SET = 'set',
  REMOVE = 'remove',
}

export type Address = string
export type Gateway = string
export type Log = { command: string, response: string }
export type Command = { mikrotik: Mikrotik, method: Method, params: Record<string, string> }

export interface Ethernet {
  name: string
  address: Address
  gateway: Gateway
  command: Command[]
  wan: boolean
  bridge: boolean
  pcc: boolean
}