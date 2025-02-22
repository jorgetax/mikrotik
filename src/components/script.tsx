'use client'
import {useEthernet} from "@/context/ethernet-context";
import styles from "./styles.module.css";
import Code from "@/components/terminal/code";
import TerminalIcon from "@/components/icon/terminal-icon";
import {Method, Mikrotik} from "@/lib/types";
import {cmd} from "@/lib/scripts";

export default function Script() {
  const {route} = useEthernet()

  const wan = route?.interfaces.filter((ethernet) => ethernet.wan)
  const bridge = route?.interfaces.filter((ethernet) => ethernet.bridge && !ethernet.wan)
  const pcc = route?.interfaces.filter((ethernet) => ethernet.pcc)

  const code = [
    '# First Time Configuration',
    // '/interface bridge add name=bridge1',
    cmd(Mikrotik.INTERFACE_BRIDGE, Method.ADD, {name: 'bridge1'}),

    // /interface bridge port add interface=${ethernet.name} bridge=bridge1
    bridge!.map((ethernet) => cmd(Mikrotik.INTERFACE_BRIDGE_PORT, Method.ADD, {
      interface: ethernet.name,
      bridge: 'bridge1',
    })).join('\n'),

    // '/ip address add address=192.168.88.1/24 interface=bridge1',
    cmd(Mikrotik.IP_ADDRESS, Method.ADD, {address: '192.168.88.1/24', interface: 'bridge1'}),

    // /routing table add disabled=no fib name=ISP1_table
    pcc?.map((ethernet, index) => cmd(Mikrotik.ROUTING_TABLE, Method.ADD, {
      disabled: 'no',
      fib: '',
      name: `${ethernet.name}_table`
    }).replace(/fib=/, 'fib').replace(/\/table/, ' table')).join('\n'),

    // /ip firewall mangle
    // add action=accept chain=prerouting dst-address=10.10.4.0/24 in-interface=ether_LAN
    // add action=accept chain=prerouting dst-address=10.10.5.0/24 in-interface=ether_LAN
    pcc?.map((ethernet, index) => cmd(Mikrotik.IP_FIREWALL_MANGLE, Method.ADD, {
      action: 'accept',
      chain: 'prerouting',
      "dst-address": `${ethernet.address}/24`,
      "in-interface": 'bridge1',
    })).join('\n'),

    // add action=mark-connection chain=input connection-state=new in-interface=ether_ISP1 new-connection-mark=ISP1
    // add action=mark-connection chain=input connection-state=new in-interface=ether_ISP2 new-connection-mark=ISP2
    pcc?.map((ethernet, index) => cmd(Mikrotik.IP_FIREWALL_MANGLE, Method.ADD, {
      action: 'mark-connection',
      chain: 'input',
      "connection-state": 'new',
      "in-interface": ethernet.name,
      "new-connection-mark": ethernet.name,
    })).join('\n'),

    // add action=mark-connection chain=output connection-mark=no-mark connection-state=new new-connection-mark=ISP1 passthrough=yes per-connection-classifier=both-addresses:2/0
    // add action=mark-connection chain=output connection-mark=no-mark connection-state=new new-connection-mark=ISP2 per-connection-classifier=both-addresses:2/1
    pcc?.map((ethernet, index) => cmd(Mikrotik.IP_FIREWALL_MANGLE, Method.ADD, {
      action: 'mark-connection',
      chain: 'output',
      "connection-mark": 'no-mark',
      "connection-state": 'new',
      "new-connection-mark": ethernet.name,
      passthrough: 'yes',
      "per-connection-classifier": `both-addresses:2/${wan!.indexOf(ethernet)}`,
    })).join('\n'),

    // add action=mark-connection chain=prerouting connection-mark=no-mark connection-state=new dst-address-type=!local in-interface=ether_LAN new-connection-mark=ISP1 per-connection-classifier=both-addresses:2/0
    // add action=mark-connection chain=prerouting connection-mark=no-mark connection-state=new dst-address-type=!local in-interface=ether_LAN new-connection-mark=ISP2 per-connection-classifier=both-addresses:2/1
    pcc?.map((ethernet, index) => cmd(Mikrotik.IP_FIREWALL_MANGLE, Method.ADD, {
      action: 'mark-connection',
      chain: 'prerouting',
      "connection-mark": 'no-mark',
      "connection-state": 'new',
      "dst-address-type": '!local',
      "in-interface": 'bridge1',
      "new-connection-mark": ethernet.name,
      "per-connection-classifier": `both-addresses:2/${wan!.indexOf(ethernet)}`,
    })).join('\n'),

    // add action=mark-routing chain=output connection-mark=ISP1 new-routing-mark=ISP1_table
    // add action=mark-routing chain=prerouting connection-mark=ISP1 in-interface=ether_LAN new-routing-mark=ISP1_table
    pcc?.map((ethernet, index) => cmd(Mikrotik.IP_FIREWALL_MANGLE, Method.ADD, {
      action: 'mark-routing',
      chain: 'output',
      "connection-mark": ethernet.name,
      "new-routing-mark": `${ethernet.name}_table`,
    })).join('\n'),
    pcc?.map((ethernet, index) => cmd(Mikrotik.IP_FIREWALL_MANGLE, Method.ADD, {
      action: 'mark-routing',
      chain: 'prerouting',
      "connection-mark": ethernet.name,
      "in-interface": 'bridge1',
      "new-routing-mark": `${ethernet.name}_table`,
    })).join('\n'),

    // /ip route
    // add check-gateway=ping disabled=no dst-address=0.0.0.0/0 gateway=10.10.4.1 routing-table=ISP1_table suppress-hw-offload=no
    // add check-gateway=ping disabled=no dst-address=0.0.0.0/0 gateway=10.10.5.1 routing-table=ISP2_table suppress-hw-offload=no
    pcc?.map((ethernet, index) => cmd(Mikrotik.IP_ROUTE, Method.ADD, {
      "check-gateway": 'ping',
      disabled: 'no',
      "dst-address": '0.0.0.0/0',
      gateway: ethernet.address,
      "routing-table": `${ethernet.name}_table`,
      "suppress-hw-offload": 'no',
    })).join('\n'),

    // add distance=1 dst-address=0.0.0.0/0 gateway=10.10.4.1
    // add distance=2 dst-address=0.0.0.0/0 gateway=10.10.5.1
    pcc?.map((ethernet, index) => cmd(Mikrotik.IP_ROUTE, Method.ADD, {
      distance: String(index + 1),
      "dst-address": '0.0.0.0/0',
      gateway: ethernet.address,
    })).join('\n'),

    // '/ip firewall mangle add chain=prerouting action=mark-connection new-connection-mark=1st_conn per-connection-classifier=src-address-and-port:3/0',
    // pcc?.map((ethernet, index) => cmd(Mikrotik.IP_FIREWALL_MANGLE, Method.ADD, {
    //   chain: 'prerouting',
    //   action: 'mark-connection',
    //   "new-connection-mark": `${ethernet.name}_conn`,
    //   "per-connection-classifier": `src-address-and-port:3/${wan!.indexOf(ethernet)}`,
    // })).join('\n'),

    '# https://help.mikrotik.com/docs/spaces/ROS/pages/152600617/Per+connection+classifier'
  ].filter(Boolean).join('\n')

  return (
    <div className={styles.codes}>
      <Code title={'some code'} svg={<TerminalIcon/>} code={code}/>
    </div>
  )
}