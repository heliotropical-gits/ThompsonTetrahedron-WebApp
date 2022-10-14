import * as React from 'react'
import {
  entryBox,
  entryImage,
  entryTitle,
  entryTitleBox,
  entryTitleText,
  entryTechText,
  entryDetailsText,
  portfolioLink
} from './portfolio_entry.module.css'
import { Link } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { MDXRenderer } from 'gatsby-plugin-mdx'

const PortfolioEntry = ( {node} ) => {
  const data = node.frontmatter
  const image = getImage(data.hero_image)
  return (
      <a className={entryBox} href={data.entrylink}>

      <div className={entryTitleBox}>
        <p className={entryTitleText}>
          {data.title}
        </p>
        <a href={data.techlink} className={entryTechText}>
          <span>
            {data.tech}
          </span>
        </a>
      </div>

      <GatsbyImage className={entryImage}
        image={image}
        alt={data.hero_image_alt}
      />

      <div className={entryDetailsText}>
        {data.abstract}
      </div>

      </a>
  )
}
export default PortfolioEntry
