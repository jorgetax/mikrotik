'use client'
import styles from "./styles.module.css";
import {useEthernet} from "@/context/ethernet-context";
import TerminalIcon from "@/components/icon/terminal-icon";
import {useEffect, useRef} from "react";

export default function Code() {
  const {route} = useEthernet()
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [route?.logs]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          <TerminalIcon/>
          <span>Terminal</span>
        </div>
        <div></div>
      </div>
      <pre className={styles.pre} ref={preRef}>
        <code className={styles.code}>
          {route?.logs.map((log, index) => (
            <span key={index} className={styles.line}>{log.time} {log.command} {log.response}</span>
          ))}
        </code>
      </pre>
    </div>
  )
}