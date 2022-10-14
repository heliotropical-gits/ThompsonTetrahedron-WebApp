import * as React from 'react'
import {
  container,
  entryDatesBox,
  entryDatesTitle,
  entryDetailsBox,
  entryDetailsTitle,
  entryPubDetailsAuthors,
  entryPubDetailsCitation,
} from './CV_entry.module.css'
import { MDXRenderer } from 'gatsby-plugin-mdx'

const CVEntryPub = ( {dates, title, authors, citation, children} ) => {
  return (
    <div className={container}>
      <div className={entryDatesBox}>
        <h3 className={entryDatesTitle}>
          {dates}
        </h3>
      </div>
      <div className={entryDetailsBox}>
        <h3 className={entryDetailsTitle}>{title}<br/></h3>
        <h2 className={entryPubDetailsAuthors} dangerouslySetInnerHTML={{__html: authors}}></h2>
        <h2 className={entryPubDetailsCitation} dangerouslySetInnerHTML={{__html: citation}}></h2>
      </div>
    </div>
  )
}
export default CVEntryPub
