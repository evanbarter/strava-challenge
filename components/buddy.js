import ProfileImage from './profile_image'
import { secsToTime } from '../lib/helpers'
import Link from 'next/link'

export default function Buddy({ buddy }) {
    const name = Object.keys(buddy)[0]

    return (
        <div className="flex flex-col sm:flex-row pt-3 sm:pt-0 items-center px-6 sm:space-x-6 hover:bg-gray-300 hover:shadow-inner">
            <div>
                <Link href="/u/[name]" as={`/u/${name}`}>
                    <a><ProfileImage image={buddy[name].image} className="h-8 w-8" /></a>
                </Link>
            </div>
            <div className="flex flex-col items-center justify-center">
                <span className="text-lg font-bold">
                    <Link href="/u/[name]" as={`/u/${name}`}>
                        <a>{name}</a>
                    </Link>
                </span>
                <span className="text-xs text-gray-600 font-medium">has similar goals</span>
            </div>
            <div className="flex-1 flex">
                <span className="text-lg font-bold">
                    {buddy[name].segments.map(segment => (
                        <span key={segment.segment}>{segment.segment} ({secsToTime(segment.ttb)})</span>
                    ))}
                </span>
            </div>
            <div className="flex flex-col items-center justify-center mb-3">
                <a href={`https://www.strava.com/athletes/${buddy[name].strava}`} target="_blank" className="flex-initial flex flex-col items-center justify-center mt-3 p-2 rounded-lg cursor-pointer bg-white text-orange-500 hover:text-white hover:bg-orange-500">
                <svg className="h-6 w-6 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" /></svg>
                    <span className="text-sm font-bold">View on Strava</span>
                </a>
            </div>
        </div>
    )
}