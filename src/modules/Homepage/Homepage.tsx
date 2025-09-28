import React from 'react'
import styles from './Homepage.module.scss'
import Hero from '@/components/Hero/Hero'
import Welcome from '@/components/Welcome/Welcome'

function Homepage() {
  return (
    <div className={styles.homepage}>
      <div className={styles.hero}>
        <Hero />
      </div>
      <div className={styles.welcome}>
        <Welcome />
      </div>
    </div>
  )
}

export default Homepage