import Head from 'next/head'
import Nav from '../components/nav'

export const siteTitle = 'The ThrillClimb Challenge'

export default function Layout({ children, home }) {
    return (
        <div className="bg-purple-900 text-white min-h-screen">
            <Head>
            <meta
                name="description"
                content="Learn how to build a personal website using Next.js"
            />
            </Head>
            <Nav home={home} />
            <main className="bg-purple-900 pb-6">{children}</main>
        </div>
    )
}
