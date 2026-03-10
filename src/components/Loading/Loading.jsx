import styles from "./Loading.module.css";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className={styles.loader}></div>
    </div>
  );
}