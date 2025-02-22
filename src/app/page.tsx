import styles from "./page.module.css";
import Form from "@/components/form";
import Script from "@/components/script";
import Terminal from "@/components/terminal/terminal";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <Form/>
      </div>
      <div className={styles.section}>
        <Script/>
        <Terminal/>
      </div>
    </div>
  )
}
