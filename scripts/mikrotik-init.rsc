/interface bridge add comment="defconf: bridge" name=bridge
/interface list add comment="defconf: contains wan interfaces" name=WAN
/interface list add comment="defconf: contains lan interfaces" name=LAN

/ip pool add comment="defconf: dhcp pool" name=pool-dhcp ranges=172.16.10.2-172.16.10.254

/interface bridge port add bridge=bridge comment="defconf: bridge" interface=ether5
/interface bridge port add bridge=bridge comment="defconf: bridge" interface=ether6
/interface bridge port add bridge=bridge comment="defconf: bridge" interface=ether7
/interface bridge port add bridge=bridge comment="defconf: bridge" interface=ether8

/interface list member add comment="defconf: wan interfaces" interface=ether1 list=WAN
/interface list member add comment="defconf: wan interfaces" interface=ether2 list=WAN
/interface list member add comment="defconf: wan interfaces" interface=ether3 list=WAN
/interface list member add comment="defconf: wan interfaces" interface=ether4 list=WAN
/interface list member add comment="defconf: lan interfaces" interface=ether5 list=LAN
/interface list member add comment="defconf: lan interfaces" interface=ether6 list=LAN
/interface list member add comment="defconf: lan interfaces" interface=ether7 list=LAN
/interface list member add comment="defconf: lan interfaces" interface=ether8 list=LAN

/ip address add address=172.16.0.2/24 comment="defconf: wan interfaces" interface=ether1 network=172.16.0.0
/ip address add address=172.16.1.2/24 comment="defconf: wan interfaces" interface=ether2 network=172.16.1.0
/ip address add address=172.16.2.2/24 comment="defconf: wan interfaces" interface=ether3 network=172.16.2.0
/ip address add address=172.16.3.2/24 comment="defconf: wan interfaces" interface=ether4 network=172.16.3.0
/ip address add address=172.16.10.1/24 comment="defconf: bridge" interface=bridge network=172.16.10.0

/ip dhcp-server add address-pool=pool-dhcp comment="defconf: dhcp server" interface=bridge name=dhcp
/ip dhcp-server network add address=172.16.10.0/24 gateway=172.16.10.1

/ip dns set servers=8.8.8.8

/ip firewall address-list add address=10.0.0.0/8 list=MikrotikDefault
/ip firewall address-list add address=172.16.0.0/12 list=MikrotikDefault
/ip firewall address-list add address=192.168.0.0/16 list=MikrotikDefault

/ip firewall mangle add action=accept chain=prerouting comment="defconf: accept MikrotikDefault" dst-address-list=MikrotikDefault src-address-list=MikrotikDefault
/ip firewall nat add action=masquerade chain=srcnat comment="defconf: masquerade all wan traffic" out-interface-list=WAN

/ip route add check-gateway=ping comment="defconf: default route" distance=1 dst-address=0.0.0.0/0 gateway=172.16.0.1
/ip route add check-gateway=ping comment="defconf: default route" distance=2 dst-address=0.0.0.0/0 gateway=172.16.1.1
/ip route add check-gateway=ping comment="defconf: default route" distance=3 dst-address=0.0.0.0/0 gateway=172.16.2.1
/ip route add check-gateway=ping comment="defconf: default route" distance=4 dst-address=0.0.0.0/0 gateway=172.16.3.1

/system identity set name="Mikrotik PCC"