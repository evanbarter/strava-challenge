import Layout, { siteTitle } from '../components/layout'
import Leaderboard from '../components/leaderboard'
import Date from '../components/date'
import { getSortedPostsData, getHomePost } from '../lib/posts'
import Link from 'next/link'
import Head from 'next/head'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  const home = await getHomePost()
  return {
    props: {
      allPostsData,
      home
    }
  }
}

export default function IndexPage({ allPostsData, home }) {
    return (
    <Layout home>
      <Head>
      <title>{`${siteTitle}`}</title>
      </Head>
      <div className="flex flex-col mt-6 space-y-12 px-4 sm:px-20">
          <div className="flex flex-col sm:flex-row sm:space-x-5">
              <div className="sm:w-2/3">
                  <h1 className="text-3xl sm:text-5xl font-black italic tracking-wide">
                      {home.title}
                  </h1>
                  <div className="prose" dangerouslySetInnerHTML={{ __html: home.contentHtml }} />
              </div>
              <div className="sm:w-1/3 bg-purple-600 p-4 rounded-lg shadow-xl mt-6">
                  <h3 className="text-3xl font-black italic tracking-wide mb-2">Updates ⁉️</h3>
                  <ul className="space-y-2">
                  {allPostsData.map(({ id, date, title }) => (
                      <li className="" key={id}>
                          <Link href="/p/[id]" as={`/p/${id}`}>
                              <a className="font-semibold">{title}</a>
                          </Link>
                          <br />
                          <small className="">
                              <Date dateString={date} />
                          </small>
                      </li>
                  ))}
                  </ul>
              </div>
        </div>

        <div>
            <h2 className="text-4xl font-black italic tracking-wide pb-2 mb-6 border-b-4 border-purple-600">Leaderboards</h2>
            <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6">
                <Leaderboard className="flex-1" title="Most Recent 🕓" />
                <Leaderboard className="flex-1" type="improved" title="Most Improved ✨" />
                <Leaderboard className="flex-1" type="segment" segmentId="612178" title="Seymour Hill Climb 🚵‍♂️" />
            </div>
        </div>
      </div>
    </Layout>
    )
}
