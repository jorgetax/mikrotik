import styles from "./styles.module.css";

export default function TerminalIcon() {
  return (
    <div className={styles.wrapper}>
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="640" viewBox="0 0 800 640">
        <path id="terminal_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24"
              d="M160-160q-33,0-56.5-23.5T80-240V-720q0-33,23.5-56.5T160-800H800q33,0,56.5,23.5T880-720v480q0,33-23.5,56.5T800-160Zm0-80H800V-640H160Zm140-40-56-56L347-440,243-544l57-56L460-440Zm180,0v-80H720v80Z"
              transform="translate(-80 800)" fill="currentColor"/>
      </svg>
    </div>
  )
}