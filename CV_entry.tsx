import * as React from 'react'
import {
  container,
  entryDatesBox,
  entryDatesTitle,
  entryDetailsBox,
  entryDetailsTitle,
  entryDetailsSubtitle,
  entryDetailsText,
} from './CV_entry.module.css'
import { MDXRenderer } from 'gatsby-plugin-mdx'

const CVEntry = ( {dates, title, company, separator, children} ) => {
  return (
    <div className={container}>
      <div className={entryDatesBox}>
        <h3 className={entryDatesTitle}>
          {dates}
        </h3>
      </div>
      <div className={entryDetailsBox}>
        <h3 className={entryDetailsTitle}>{title}<br/></h3>
        <h2 className={entryDetailsSubtitle}>{separator} {company}</h2>
        {
          <div className={entryDetailsText}
            dangerouslySetInnerHTML={{__html: children}}
          />
        }
      </div>

    </div>
  )
}
export default CVEntry
