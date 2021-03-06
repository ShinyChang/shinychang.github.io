import React from "react"
import { Link, graphql } from "gatsby"
import Helmet from "react-helmet"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import Button from "../components/button"
import TagList from "../components/TagList"

class BlogList extends React.Component {
  render() {
    const { data, pageContext } = this.props
    const { currentPage, numPages } = pageContext
    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? "/" : (currentPage - 1).toString()
    const nextPage = (currentPage + 1).toString()
    const { title: siteTitle, siteUrl } = data.site.siteMetadata
    const posts = data.allMarkdownRemark.edges
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        <Helmet>
          <link
            rel="canonical"
            href={`${siteUrl}/blog/${isFirst ? "" : currentPage}`}
          />
        </Helmet>
        <Bio />
        <div style={{ margin: "20px 0 40px" }}>
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <div key={node.fields.slug}>
                <h3
                  style={{
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                  <Link
                    style={{ boxShadow: `none` }}
                    to={`/blog${node.fields.slug}`}
                  >
                    {title}
                  </Link>
                </h3>

                <small>
                  {node.frontmatter.date}{" "}
                  <TagList tags={node.frontmatter.tags} />
                </small>

                <p>{node.excerpt}</p>
              </div>
            )
          })}
        </div>
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            listStyle: "none",
            padding: 0,
          }}
        >
          {!isFirst && (
            <Link to={`/blog/${prevPage}`} rel="prev">
              ←
            </Link>
          )}
          <li
            style={{
              display: "flex",
              flexGrow: 1,
              margin: 0,
              justifyContent: "center",
            }}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <Link
                key={i}
                to={`/blog/${i === 0 ? "" : i + 1}`}
                style={{
                  padding: rhythm(1 / 4),
                  marginLeft: rhythm(1 / 4),
                  marginRight: rhythm(1 / 4),
                  textDecoration: "none",
                  color: i + 1 === currentPage ? "#ffffff" : "",
                  background: i + 1 === currentPage ? "#007acc" : "",
                }}
              >
                {i + 1}
              </Link>
            ))}
          </li>
          {!isLast && (
            <Link to={`/blog/${nextPage}`} rel="next">
              →
            </Link>
          )}
        </ul>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </Layout>
    )
  }
}

export default BlogList

export const pageQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            tags
          }
        }
      }
    }
  }
`
