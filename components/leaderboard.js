import { secsToTime } from '../lib/helpers'
import ProfileImage from '../components/profile_image'
import Link from 'next/link'
import useSWR from 'swr'

const fetcher = url => fetch(url).then(res => res.json());

export default function Leaderboard({ title, type, segmentId, ...props }) {
    let api = '/api/leaderboards'

    if (type === 'improved') {
        title = title || 'Most Improved'
        api += '?type=improved'
    } else if (type === 'segment') {
        api += `?type=segment&segment=${segmentId}`
    } else {
        title = title || 'Most Recent'
    }

    const { data, error } = useSWR(api, fetcher)


    if (error) return <div className={`${props.className} rounded-lg bg-gray-200 shadow-xl p-4`}>Error :(</div>
    if (!data) return <div className={`${props.className} rounded-lg bg-gray-200 shadow-xl p-4`}>Loading...</div>

    title = type === 'segment' && data.length ? title || data[0].segment_name : title

    return (
        <div className={`${props.className} rounded-lg bg-gray-200 shadow pb-3`}>
            <h3 className="text-gray-800 font-bold mx-3 mb-3 pt-3 pb-3 border-b-2 border-gray-500">{title}</h3>
            <div className="space-y-4">
            { data.length ?
                data.map(row => (
                    <div key={`${row.user_id}${row.segment_id}`} className="flex items-center space-x-3 px-4 py-1 text-md hover:bg-gray-300 hover:shadow-inner">
                        <Link href="/u/[name]" as={`/u/${row.name}`}>
                            <a><ProfileImage image={row.image} className="h-8 w-8 cursor-pointer" /></a>
                        </Link>
                        <div className="flex-1 flex flex-col">
                            <span><Link href="/u/[name]" as={`/u/${row.name}`}><a className="font-bold">{row.name}</a></Link> went {(Math.abs(row.improved) * 100).toPrecision(3)}% faster</span>
                            <span className="text-xs italic">{ type !== 'segment' ? <span>on <strong>{row.segment_name}</strong></span> : '' } ({secsToTime(row.time_to_beat)} → {secsToTime(row.new_best)})</span>
                            <span className="text-xs italic">at {row.date_formatted}</span>
                        </div>
                        <a href={`https://www.strava.com/activities/${row.activity_id}`} target="_blank" className="rounded-lg p-2 bg-white text-orange-500 hover:bg-orange-500 hover:text-white"><svg className="h-6 w-6 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" /></svg></a>
                    </div>
                )) : (<span className="mx-4">No results yet</span>)
            }
            </div>
        </div>
    )
}
