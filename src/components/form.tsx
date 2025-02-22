'use client'
import {useEffect, useState} from "react";
import {Ethernet} from "@/lib/types";
import styles from "./styles.module.css";
import cn from "clsx";
import {useEthernet} from "@/context/ethernet-context";
import {gateway} from "@/lib/scripts";

export default function Form() {
  const {route, interfaces, logs} = useEthernet()
  const [data, setData] = useState(route ? route.interfaces : [])

  useEffect(() => {
    interfaces(data)
  }, [data])

  const onChange = (e: any, index: number) => {
    const {name, value} = e.target
    const rows = [...data]
    const current = rows[index] as any
    current[name] = value

    if (name === 'address') {
      current.gateway = gateway(value)
    }

    setData(rows)
    interfaces(rows)
  }

  const onWan = (ethernet: Ethernet, index: number) => {
    const rows = [...data]
    const current = rows.find(row => row.name === ethernet.name)
    // e.g. bridge and wan can't be enabled at the same time
    if (current && !current.bridge) {
      current.wan = !current.wan
      current.pcc = false
      logs({message: `lan interface ${current.name} wan ${current.wan}`})
    }
    setData(rows)
  }

  const onBridge = (ethernet: Ethernet, index: number) => {
    const rows = [...data]
    const current = rows.find(row => row.name === ethernet.name)

    if (current && !current.wan) {
      current.bridge = !current.bridge
      current.pcc = false
      logs({message: `lan interface ${current.name} bridge ${current.bridge}`})
    }
    setData(rows)
  }

  const onPcc = (ethernet: Ethernet, index: number) => {
    const rows = [...data]
    const current = rows.find(row => row.name === ethernet.name)
    if (current && current.wan) {
      current.pcc = !current.pcc
      current.bridge = false
      logs({message: `lan interface ${current.name} pcc ${current.pcc}`})
    }
    setData(rows)
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    console.log(data)
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <table className={styles.table}>
        <thead>
        <tr>
          <th>Interface</th>
          <th>Address</th>
          <th>Gateway</th>
          <th>WAN</th>
          <th>Bridge</th>
          <th>PCC</th>
        </tr>
        </thead>
        <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td><input type="text" name="name" placeholder="Name" value={row.name} onChange={e => onChange(e, index)}/>
            </td>
            <td><input type="text" name="address" placeholder="192.168.1.2/24" value={row.address}
                       onChange={e => onChange(e, index)}/></td>
            <td><input type="text" name="gateway" placeholder="192.168.1.1" value={row.gateway}
                       onChange={e => onChange(e, index)}/></td>
            <td>
              <button type="button" className={cn(styles.button, row.wan && styles.active)}
                      onClick={() => onWan(row, index)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="880" height="480" viewBox="0 0 880 480">
                  <path id="settings_ethernet_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24"
                        d="M680-240l-56-56L806-480,624-664l56-56L920-480Zm-400,0L40-480,280-720l56,56L154-480,336-296Zm40-200q-17,0-28.5-11.5T280-480q0-17,11.5-28.5T320-520q17,0,28.5,11.5T360-480q0,17-11.5,28.5T320-440Zm160,0q-17,0-28.5-11.5T440-480q0-17,11.5-28.5T480-520q17,0,28.5,11.5T520-480q0,17-11.5,28.5T480-440Zm160,0q-17,0-28.5-11.5T600-480q0-17,11.5-28.5T640-520q17,0,28.5,11.5T680-480q0,17-11.5,28.5T640-440Z"
                        transform="translate(-40 720)" fill="currentColor"/>
                </svg>
              </button>
            </td>
            <td>
              <button type="button" className={cn(styles.button, row.bridge && styles.active)}
                      onClick={() => onBridge(row, index)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="960" height="920" viewBox="0 0 960 920">
                  <path id="hub_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24"
                        d="M240-40q-50,0-85-35t-35-85q0-50,35-85t85-35a107.012,107.012,0,0,1,26,3,133.98,133.98,0,0,1,23,8l57-71a173.611,173.611,0,0,1-39-70,182.157,182.157,0,0,1-5-78l-81-27a129.88,129.88,0,0,1-43,40q-26,15-58,15-50,0-85-35T0-580q0-50,35-85t85-35q50,0,85,35t35,85v8l81,28a191.318,191.318,0,0,1,53.5-61A171.519,171.519,0,0,1,450-637v-87a124.606,124.606,0,0,1-64.5-42.5Q360-798,360-840q0-50,35-85t85-35q50,0,85,35t35,85q0,42-26,73.5T510-724v87a171.519,171.519,0,0,1,75.5,32A191.318,191.318,0,0,1,639-544l81-28v-8q0-50,35-85t85-35q50,0,85,35t35,85q0,50-35,85t-85,35q-32,0-58.5-15A119.437,119.437,0,0,1,739-515l-81,27a179.544,179.544,0,0,1-5,77.5Q642-372,614-340l57,70a109.243,109.243,0,0,1,23-7.5,127.481,127.481,0,0,1,26-2.5q50,0,85,35t35,85q0,50-35,85T720-40q-50,0-85-35t-35-85a115.3,115.3,0,0,1,6.5-38.5A128.015,128.015,0,0,1,624-232l-57-71a176.058,176.058,0,0,1-87.5,23A176.058,176.058,0,0,1,392-303l-56,71a128.015,128.015,0,0,1,17.5,33.5A115.3,115.3,0,0,1,360-160q0,50-35,85T240-40ZM120-540q17,0,28.5-11.5T160-580q0-17-11.5-28.5T120-620q-17,0-28.5,11.5T80-580q0,17,11.5,28.5T120-540ZM240-120q17,0,28.5-11.5T280-160q0-17-11.5-28.5T240-200q-17,0-28.5,11.5T200-160q0,17,11.5,28.5T240-120ZM480-800q17,0,28.5-11.5T520-840q0-17-11.5-28.5T480-880q-17,0-28.5,11.5T440-840q0,17,11.5,28.5T480-800Zm0,440q42,0,71-29t29-71q0-42-29-71t-71-29q-42,0-71,29t-29,71q0,42,29,71T480-360ZM720-120q17,0,28.5-11.5T760-160q0-17-11.5-28.5T720-200q-17,0-28.5,11.5T680-160q0,17,11.5,28.5T720-120ZM840-540q17,0,28.5-11.5T880-580q0-17-11.5-28.5T840-620q-17,0-28.5,11.5T800-580q0,17,11.5,28.5T840-540ZM480-840ZM120-580ZM480-460ZM840-580ZM240-160ZM720-160Z"
                        transform="translate(0 960)" fill="currentColor"/>
                </svg>
              </button>
            </td>
            <td>
              <button type="button" className={cn(styles.button, row.pcc && styles.active)}
                      onClick={() => onPcc(row, index)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="880" height="880" viewBox="0 0 880 880">
                  <path id="linked_services_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24"
                        d="M760-600q-57,0-99-34t-56-86H354a156.971,156.971,0,0,1-41.5,72.5A156.971,156.971,0,0,1,240-606v251q52,14,86,56t34,99q0,66-47,113T200-40Q134-40,87-87T40-200q0-57,34-99t86-56V-606q-52-14-86-56T40-760q0-66,47-113t113-47q56,0,98,34t56,86H605q14-52,56-86t99-34q66,0,113,47t47,113q0,66-47,113T760-600ZM200-120q33,0,56.5-24T280-200q0-33-23.5-56.5T200-280q-32,0-56,23.5T120-200q0,32,24,56T200-120Zm0-560q33,0,56.5-23.5T280-760q0-33-23.5-56.5T200-840q-32,0-56,23.5T120-760q0,33,24,56.5T200-680ZM760-40q-66,0-113-47T600-200q0-66,47-113t113-47q66,0,113,47t47,113q0,66-47,113T760-40Zm0-80q33,0,56.5-24T840-200q0-33-23.5-56.5T760-280q-33,0-56.5,23.5T680-200q0,32,23.5,56T760-120Zm0-560q33,0,56.5-23.5T840-760q0-33-23.5-56.5T760-840q-33,0-56.5,23.5T680-760q0,33,23.5,56.5T760-680ZM200-200ZM200-760ZM760-200ZM760-760Z"
                        transform="translate(-40 920)" fill="currentColor"/>
                </svg>
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </form>
  )
}