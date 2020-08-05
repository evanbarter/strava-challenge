import { useRouter } from 'next/router'
import { secsToTime } from '../lib/helpers'

export default function Segment({ afterAction, segment }) {
    const router = useRouter()
    const { name } = router.query

    function addChallenge(id, segment, ttb) {
        fetch(process.env.NEXT_PUBLIC_URL+'/api/challenges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id, segment: segment, ttb: ttb })
        }).then(afterAction)
    }

    return (
        <div className="flex px-6 pb-3 hover:bg-purple-700 hover:shadow-inner">
            <div className="flex flex-col flex-grow">
                <h3 className="text-4xl font-semibold italic">
                    {segment.name}
                </h3>
                <div className="flex space-x-4">
                    <span className="text-sm text-purple-300">
                        <svg className="inline h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg> {Number.parseFloat((segment.distance / 1000)).toPrecision(3)} km
                    </span>
                    <span className="text-sm text-purple-300">
                        {segment.average_grade >= 0 ? <svg className="inline h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path></svg> : <svg className="inline h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd"></path></svg>} {segment.average_grade}%
                    </span>
                    <span className="text-sm text-purple-300">
                        <svg className="inline h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> {segment.athlete_pr_effort ? secsToTime(segment.athlete_pr_effort.elapsed_time) : 'Not set yet'}
                    </span>
                </div>
            </div>
            <a href={`https://www.strava.com/segments/${segment.id}`} target="_blank" className="flex-initial flex flex-col items-center justify-center mt-3 p-2 rounded cursor-pointer hover:bg-white hover:text-purple-900 mr-6">
            <svg className="h-6 w-6 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" /></svg>
                <span className="text-sm font-bold">View on Strava</span>
            </a>
            <div onClick={addChallenge.bind(this, segment.id, segment.name, segment.athlete_pr_effort ? segment.athlete_pr_effort.elapsed_time : false)} className="flex-initial flex flex-col items-center justify-center mt-3 p-2 rounded cursor-pointer hover:bg-white hover:text-purple-900">
                <svg className="h-8 w-8 block" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.757 2.034a1 1 0 01.638.519c.483.967.844 1.554 1.207 2.03.368.482.756.876 1.348 1.467A6.985 6.985 0 0117 11a7.002 7.002 0 01-14 0c0-1.79.684-3.583 2.05-4.95a1 1 0 011.707.707c0 1.12.07 1.973.398 2.654.18.374.461.74.945 1.067.116-1.061.328-2.354.614-3.58.225-.966.505-1.93.839-2.734.167-.403.356-.785.57-1.116.208-.322.476-.649.822-.88a1 1 0 01.812-.134zm.364 13.087A2.998 2.998 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879.586.585.879 1.353.879 2.121s-.293 1.536-.879 2.121z" clipRule="evenodd"></path></svg>
                <span className="text-sm font-bold">Add Challenge</span>
            </div>
        </div>
    )
}