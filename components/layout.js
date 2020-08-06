import Head from 'next/head'
import Nav from '../components/nav'

export const siteTitle = process.env.NEXT_PUBLIC_TITLE

export default function Layout({ children, home }) {
    return (
        <div className="bg-gray-300 text-gray-700 min-h-screen">
            <Head>
            <meta
                name="description"
                content="So you don't like the old-time bikes, huh? https://www.youtube.com/watch?v=uImQkrGG2wQ"
            />
            </Head>
            <Nav home={home} />
            <main className="bg-gray-300 pb-6">{children}</main>
        </div>
    )
}
