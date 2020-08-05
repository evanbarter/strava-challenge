import Head from 'next/head'
import Layout from '../../components/layout'
import Date from '../../components/date'
import { getAllPostIds, getPostData } from '../../lib/posts'

export async function getStaticPaths() {
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id)
    return {
      props: {
        postData
      }
    }
  }

export default function Post({ postData }) {
    return (
    <Layout>
        <Head>
            <title>{postData.title}</title>
        </Head>
        <article className="mt-8 px-4">
            <h1 className="max-w-3xl mx-auto text-3xl sm:text-5xl font-black italic leading-tight tracking-wide">{postData.title}</h1>
            <div className="max-w-3xl mx-auto mt-4 text-sm">
                <Date dateString={postData.date} />
            </div>
            <div className="prose prose-lg mt-8 mx-auto" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
    </Layout>)
}