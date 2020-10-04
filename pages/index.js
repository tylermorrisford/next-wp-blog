import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
var dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)


export default function Home({ blogPosts }) {
  
  const stripTags = (text) => {

    text.replace('<', '');
    text.replace('/', '');
    text.replace('p', '');
    text.replace('>', '');

    return text;

  }
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>I'm Tyler. This is the 'jamstack'(-ish) version of my blog.</p><p>Currently I'm hacking the getStaticProps method. and it's kind of working!</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog Posts:</h2>
        {console.log('this is blogPosts array', blogPosts)}
        <ul className={utilStyles.list}>
          {blogPosts.map(post => (
            <li className={utilStyles.listItem} key={post.node.id}>
              <strong>{post.node.title}</strong>
              <br />
              <small>{dayjs(post.node.date).utcOffset(-12).format('dddd, MMMM D, YYYY h:mm A')}</small>
              <p>{post.node.content.replace(/<\/?p[^>]*>/g, "")}</p>
              <hr/>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const blogAPI = `http://www.tylermorrisford.com/graphql`;
  const query = `query GET_POSTS {
    posts {
      edges {
        node {
          id
          title
          content
          date
        }
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
  const blogPosts = blogData.data.posts.edges
  return {
    props: {
      blogPosts
    }
  }
}
