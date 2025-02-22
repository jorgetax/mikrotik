'use client'
import styles from "./styles.module.css";
import {useEthernet} from "@/context/ethernet-context";
import TerminalIcon from "@/components/icon/terminal-icon";
import {useEffect, useRef} from "react";

export default function Terminal() {
  const {route} = useEthernet()
  const preRef = useRef<HTMLPreElement>(null);

  const logs = route && route.logs.map((log, i) => log.message).join('\n')

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [route?.logs]);

  const highlight = (code: string) => {
    // html use counter-increment: line; counter-reset: line 0; to number lines
    const lines = code.split('\n')

    return lines.map((line, index) => (
      <span key={index} className={styles.line} dangerouslySetInnerHTML={{__html: line}}></span>
    ))
  }

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
          {logs && highlight(logs)}
        </code>
      </pre>
    </div>
  )
}