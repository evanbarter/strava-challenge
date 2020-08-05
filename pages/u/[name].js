import React, { useState, useEffect } from 'react'
import Layout, { siteTitle } from '../../components/layout'
import Segment from '../../components/segment'
import Challenge from '../../components/challenge'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession, getSession } from 'next-auth/client'

function User() {
    const [segments, setSegments] = useState([])
    const [challenges, setChallenges] = useState([])
    const router = useRouter()
    const { name } = router.query
    const [ session ] = useSession()

    async function loadChallenges() {
        const res = await fetch(process.env.NEXT_PUBLIC_URL+'/api/challenges?name='+name)
        const challenges = await res.json()

        setChallenges(challenges)
    }

    async function loadSegments() {
        const res = await fetch(process.env.NEXT_PUBLIC_URL+'/api/segments')
        const segments = await res.json()

        setSegments(segments)
    }

    useEffect(() => {
        if (session && session.user && session.user.name === name) {
            loadSegments()
        }
        loadChallenges()
    }, [name])

    return (
        <Layout>
            <Head>
                <title>{`${name} | ${siteTitle}`}</title>
            </Head>
            <div className="space-y-8 mt-8 mx-2">
                <section className="mx-auto max-w-6xl bg-purple-800 rounded-lg shadow-lg p-6 pt-4">
                    <h2 className="text-4xl font-black italic tracking-wide border-b-4 border-purple-600 mb-4 pb-2">Challenges</h2>
                    <div className="px-2 space-y-4">
                    { challenges.length ?
                        challenges.map(challenge => (
                            <Challenge afterAction={loadChallenges} challenge={challenge} canRemove={session && session.user.name === name} key={`${challenge.user_id}${challenge.segment_id}`} />
                        )) :
                        session && session.user && session.user.name === name
                            ? 'You have not added any challenges yet. Add some from the segments below.'
                            : name + ' has not added any challenges yet.'
                    }
                    </div>
                </section>
                {segments.length ?
                <section className="mx-auto max-w-6xl bg-purple-800 rounded-lg shadow-lg pb-3">
                    <h2 className="relative text-4xl font-black italic tracking-wide border-b-4 border-purple-600 m-6 pt-4 pb-2">
                        Segments
                        <span className="group absolute inset-y-0 right-0 text-sm font-normal tracking-tight flex items-center cursor-pointer">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
                            <span className="hidden bg-black p-2 absolute right-0 top-0 mt-12 group-hover:block w-48">These are loaded from your starred segments on Strava.</span>
                        </span>
                    </h2>
                    <div className="space-y-2">
                        {segments.map(segment => (
                            <Segment afterAction={loadChallenges} segment={segment} key={segment.id} />
                        ))}
                    </div>
                </section> : ''}
                {!segments.length && session && session.user && session.user.name === name ?
                <section className="mx-auto max-w-6xl bg-purple-800 rounded-lg shadow-lg pb-3">
                    <h2 className="relative text-4xl font-black italic tracking-wide border-b-4 border-purple-600 m-6 pt-4 pb-2">
                        Segments
                        <span className="group absolute inset-y-0 right-0 text-sm font-normal tracking-tight flex items-center cursor-pointer">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
                            <span className="hidden bg-black p-2 absolute right-0 top-0 mt-12 group-hover:block w-48">These are loaded from your starred segments on Strava.</span>
                        </span>
                    </h2>
                    <div className="space-y-2 px-6 mb-2">
                        You'll need to ⭐️ some <a className="text-purple-300 border-b-2 border-purple-300 pb-1" href="https://www.strava.com/athlete/segments/starred">segments on Strava</a> before they will appear here. Perhaps <a className="text-purple-300 border-b-2 border-purple-300 pb-1" href="https://www.strava.com/segments/17267489" target="_blank">this one</a> or <a className="text-purple-300 border-b-2 border-purple-300 pb-1" href="https://www.strava.com/segments/612178" target="_blank">this one</a>?
                    </div>
                </section>: '' }
            </div>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    return {
      props: { session }
    }
}

export default User