'use client'
import styles from "./styles.module.css";
import {useEffect, useRef} from "react";
import cn from "clsx";

type Props = { title: string, svg: React.ReactNode, code: string | undefined }

export default function Code({title, svg, code}: Props) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [code]);

  const highlight = (code: string) => {
    // html use counter-increment: line; counter-reset: line 0; to number lines
    const lines = [...code.split('\n')]

    return lines.map((line, index) => {

      const span = (text: string, style: string) => {
        const classes = styles[style]
        return `<span class="${classes}">${text}</span>`
      }
      // highlight keywords
      line = line.replace(/(\/\w+)/g, span('$1', 'keyword'))
      // highlight comments
      line = line.replace(/(#.*)/g, span('$1', 'comment'))

      return <span key={index} className={cn(styles.line)} dangerouslySetInnerHTML={{__html: line}}></span>
    })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          {svg}
          <span>{title}</span>
        </div>
        <div></div>
      </div>
      <pre className={styles.pre} ref={preRef}>
        <code className={styles.code}>
          {code && highlight(code)}
        </code>
      </pre>
    </div>
  )
}