import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css'
var dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)


export default function Home({ blogPosts }) {
  
  const ulStyle = {
    listStyleType: 'none', 
    paddingInlineStart: 0, 
    margin: '0 auto', 
  }
  
  const liStyle = {
    float: 'left',
    height: '20px',
    margin: '0 10px 0',
    textalign: 'center',
    clear: 'bottom'
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>I'm Tyler <small>(39, he/him, loves hockey and delicious beers)</small>, and this is the 'jamstack'(-ish) version of an old wordpress blog.</p><p>This is hacked together from the Next.js blog tutorial, using some of their recommended methods but ignoring some of the others. I wanted a way to only pull newer posts from said blog, and with GraphQL it's super, super easy.</p>
        <p>Much like checking out your old myspace page, checking back in with an old blog can be uniquely cringe-inducing.</p>
        <span>In case you don't care about one of these topics, filter the posts with these links:</span>
        <div style={{display: 'flex', alignItems: 'center'}}>
        <ul style={ulStyle}>
          <li className='li'><Link href="/devPosts">developer stuff</Link></li>
          <li className='li'><Link href="/parentingPosts">parenting stuff</Link></li>
          <li className='li'><Link href="/superRandom">super random stuff</Link></li>
        </ul>
        </div>
      </section>
      <br/>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Latest Posts:</h2>
        {console.log('this is blogPosts array', blogPosts)}
        <ul className={utilStyles.list}>
          {blogPosts.map((post, i) => (
            <li className={utilStyles.listItem} key={post.node.id}>
              <strong>{post.node.title}</strong>
              <br />
              <small>{dayjs(post.node.date).utcOffset(-12).format('dddd, MMMM D, YYYY h:mm A')}</small>
              <div dangerouslySetInnerHTML={{__html: post.node.content}}></div>
              {i < blogPosts.length - 1 ? <hr/> : ''}
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
