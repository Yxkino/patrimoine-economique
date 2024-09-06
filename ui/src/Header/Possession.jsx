import React from 'react'
import ListPossession from '../Pages/ListPossession'
import Button from '../Components/Button'
import styles from './Possession.module.css' 

export default function Possession() {
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <Button print={"Create Possession"} target={"create"} className={styles.button} />
        <Button print={"Menu"} target={"/"} className={styles.button} />
      </div>
      <ListPossession/>
    </div>
  )
}