import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css'
var dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

export default function devPosts({blogPosts}) {

    return (
        <Layout home>
          <Head>
            <title>{siteTitle}</title>
          </Head>
          <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
            <h2 className={utilStyles.headingLg}>Developer Stuff:</h2>
            {console.log('this is blogPosts array', blogPosts)}
            <ul className={utilStyles.list}>
              {blogPosts && blogPosts.map((node, i) => (
                <li className={utilStyles.listItem} key={node.id}>
                  <strong>{node.title}</strong>
                  <br />
                  <small>{dayjs(node.date).utcOffset(-12).format('dddd, MMMM D, YYYY h:mm A')}</small>
                  <div dangerouslySetInnerHTML={{__html: node.content}}></div>
                  {i < blogPosts.length - 1 ? <hr/> : ''}
                </li>
              ))}
            </ul>
            <p><Link href="/"><a>&#8592; home</a></Link></p>
          </section>
        </Layout>
      )
}


export async function getStaticProps() {
    const blogAPI = `http://www.tylermorrisford.com/graphql`;
    const query =  `query {
        posts(where: {categoryName: "developer"}) {
          nodes {
            title
            id
            slug
            postId
            date
            content
          }
        }
      }`
    const res = await fetch(blogAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query}),
    })
    const blogData = await res.json();
    console.log('this is blogdata', JSON.stringify(blogData));
    const blogPosts = blogData.data.posts.nodes
    return {
      props: {
        blogPosts
      }
    }
  }
