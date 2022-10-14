import * as React from 'react'
import {
  container,
  entryBox,
  entryImage,
  entryTitle,
} from './portfolio_entry.module.css'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import { MDXRenderer } from 'gatsby-plugin-mdx'

const PortfolioEntry = ( {node} ) => {
  return (
    <div className={container}>
      {
        // Change link to new object if decide to make it a pop-out box
      }
      <Link className={entryBox} to={node.frontmatter.entrylink.relativePath}>
      <p className={entryTitle}>
        {node.frontmatter.title} / {node.frontmatter.tech}
      </p>      
      <StaticImage className={entryImage}
        alt={node.frontmatter.hero_image_alt}
        src={node.frontmatter.hero_image.relativePath}
      />
      </Link>
    </div>
  )
}
export default PortfolioEntry
