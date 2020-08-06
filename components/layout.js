import Head from 'next/head'
import Nav from '../components/nav'

export const siteTitle = process.env.NEXT_PUBLIC_TITLE

export default function Layout({ children, home }) {
    return (
        <div className="bg-gray-300 text-gray-700 min-h-screen flex flex-col">
            <Head>
            <meta
                name="description"
                content="So you don't like the old-time bikes, huh? https://www.youtube.com/watch?v=uImQkrGG2wQ"
            />
            </Head>
            <Nav home={home} />
            <main className="flex-grow bg-gray-300 pb-6">{children}</main>
            <footer className="flex justify-center space-x-3 text-sm p-2">
                <span className="border-r border-gray-500 pr-3">Created by <a className="font-bold text-purple-500 hover:text-purple-600" href="https://evanbarter.me" target="_blank">Evan Barter</a></span>
                <span className="border-r border-gray-500 pr-3">
                    <a href="https://github.com/evanbarter/strava-challenge" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                    </a>
                </span>
                <span>Powered by <a className="font-bold text-orange-500 hover:text-orange-600" href="https://www.strava.com" target="_blank">Strava</a></span>
            </footer>
        </div>
    )
}
