'use client'
import {useEthernet} from "@/context/ethernet-context";
import styles from "./styles.module.css";
import Code from "@/components/terminal/code";
import TerminalIcon from "@/components/icon/terminal-icon";

export default function CodeList() {
  const {route} = useEthernet()

  return (
    <div className={styles.codes}>
      <Code title={'some code'} svg={<TerminalIcon/>} data={JSON.stringify(route?.interfaces, null, 2)}/>
    </div>
  )
}