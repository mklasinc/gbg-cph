import React from 'react'
import styles from './Typography.module.scss'
export default {
  title: 'Vars/Typography',
  component: <div />,
}

export const Default = (args: any) => (
  <div>
    <p className={styles.typo__h1ultra}>headline 1 ultra</p>
    <p className="typo__h1">headline 1</p>
    <p className="typo__h2">headline 2</p>
    <p className="typo__h3">headline 3</p>
    <p className="typo__subheadline">subheadline</p>
    <p className="typo__cta">cta</p>
    <p className="typo__body">body (medium)</p>
    <p className="typo__caption">captions / annotations</p>
  </div>
)

Default.args = {}
