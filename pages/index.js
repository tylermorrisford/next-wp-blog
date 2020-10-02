import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
var dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)


export default function Home({ blogPosts }) {
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
            <li className={utilStyles.listItem} key={post.id}>
              <strong>{post.title.rendered}</strong>
              <br />
              <small>{dayjs(post.date).utcOffset(-12).format('dddd, MMMM D, YYYY h:mm A')}</small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const blogAPI = `http://www.tylermorrisford.com/wp-json/wp/v2/posts?categories=4`;
  const res = await fetch(blogAPI)
  const blogPosts = await res.json()
  console.log(blogPosts);
  return {
    props: {
      blogPosts
    }
  }
}
