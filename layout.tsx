import * as React from 'react'
import { Link, Script, useStaticQuery, graphql } from 'gatsby'
import { container,
  siteTitleBox,
  heading,
  navLinks,
  navLinkItem,
  navLinkText,
  socialIcon,
  navBar,
  socials,
  socialLinks,
  socialLinkItem,
  socialLinkText,
  socialHeaderText,
  copyright,
  siteTitle
} from './layout.module.css'

const Layout = ({ pageTitle, children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  return (
    <div className={container}>
    <Script src="https://kit.fontawesome.com/800bcb2a22.js" crossorigin="anonymous"/>
    <header className={siteTitle}>{data.site.siteMetadata.title}</header>
      <nav className={navBar}>
        <ul className={navLinks}>
          <li className={navLinkItem}>
            <Link className={navLinkText} to="/">
              Home
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link className={navLinkText} to="/portfolio">
              Portfolio
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link to="/blog" className={navLinkText}>
              Blog
            </Link>
          </li>
        </ul>
      </nav>
      <main>
        <h1 className={heading}>{pageTitle}</h1>
        {children}
      <div className={socials}>
        <p className={socialHeaderText}>Connect with me on:</p>
        <ul className={socialLinks}>
          <li className={socialLinkItem}>
            <a className={socialLinkText} to="https://www.linkedin.com/in/fr%C3%A9d%C3%A9ric-houll%C3%A9-6b764673/">
              <i class="fa-brands fa-linkedin"></i>
              LinkedIn
            </a>
          </li>
          <li className={socialLinkItem}>
            <a className={socialLinkText} to="https://github.com/heliotropical-gits">
              <i class="fa-brands fa-square-github"></i>
              Github
            </a>
          </li>
          <li className={socialLinkItem}>
            <a className={socialLinkText} to="https://web.facebook.com/frederic.houlle/">
              <i class="fa-brands fa-square-facebook"></i>
              Facebook
            </a>
          </li>
          <li className={socialLinkItem}>
            <a className={socialLinkText} to="https://www.instagram.com/vagabond_chameleon/">
              <i class="fa-brands fa-square-instagram social-icon"></i>
              Instagram
            </a>
          </li>
        </ul>
      </div>
      <div className={copyright}>
        © Frédéric Houllé 2022, made with <a to="https://www.gatsbyjs.com">Gatsby</a>, all rights reserved.
      </div>
      </main>
    </div>
  )
}
export default Layout
