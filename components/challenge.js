import React, { useState, useEffect } from 'react'
import { secsToTime } from '../lib/helpers'

export default function Challenge({ afterAction, challenge, canRemove }) {
    const [editing, setEditing] = useState(false)
    const [customTTB, setTTB] = useState({ h: 0, m: 0, s: 0})

    useEffect(() => {
        if (!challenge.time_to_beat) {
            setEditing(true)
        } else {
            const h = Math.floor(challenge.time_to_beat / 3600)
            const m = Math.floor(challenge.time_to_beat % 3600 / 60)
            const s = Math.floor(challenge.time_to_beat % 3600 % 60)

            setTTB({ h: h, m: m, s: s })
        }
    }, [])

    function delChallenge(id) {
        fetch(process.env.NEXT_PUBLIC_URL+'/api/challenges', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        }).then(afterAction)
    }

    function updateChallenge(id) {
        const h = parseInt(customTTB.h)
        const m = parseInt(customTTB.m)
        const s = parseInt(customTTB.s)

        if (typeof h === 'number' && typeof m === 'number' && typeof s === 'number') {
            const ttb = s + (m * 60) + (h * 60 * 60)
            fetch(process.env.NEXT_PUBLIC_URL+'/api/challenges', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id, ttb: ttb })
            }).then(() => {
                setEditing(false)
                afterAction()
            })
        }
    }

    const canEdit = canRemove && !challenge.new_best

    const remove = canRemove ? (
        <div className="sm:w-1/12 flex flex-col items-center justify-center mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-400 sm:border-0">
            <svg onClick={delChallenge.bind(this, challenge.segment_id)} className="h-6 w-6 rounded-full inline hover:bg-white hover:text-gray-900 cursor-pointer" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </div>
    ) : ''

    const view = challenge.new_best ? (
        <a href={`https://www.strava.com/activities/${challenge.activity_id}`} target="_blank" className="sm:w-2/12 p-2 flex flex-col items-center justify-center rounded-lg cursor-pointer bg-white text-orange-500 hover:text-white hover:bg-orange-500 group">
            <svg className="h-6 w-6 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" /></svg>
            <span className="text-sm text-orange-500 group-hover:text-white font-bold">View on Strava</span>
        </a>
    ) : (
        <div className="sm:w-2/12 flex flex-col items-center justify-center">
            <span className="text-xl font-bold">Not set yet</span>
            <span className="text-xs text-gray-600 font-medium">view on Strava</span>
        </div>
    )

    return (
        <div className="flex flex-col sm:flex-row sm:space-x-4">
            <h3 className={`${canRemove ? "sm:w-3/12" : "sm:w-4/12"} text-center sm:text-left text-3xl font-semibold italic mb-4 sm:mb-0`}>{challenge.segment_name}</h3>
            <div className="sm:w-2/12 flex flex-col items-center justify-center">
                { editing
                    ? (
                        <span>
                        <input value={customTTB.h} onChange={(event) => { setTTB({ ...customTTB, h: event.target.value }) }} className="rounded text-center inline w-5 h-6 text-gray-800 text-sm" type="text" /> h&nbsp;
                        <input value={customTTB.m} onChange={(event) => { setTTB({ ...customTTB, m: event.target.value }) }} className="rounded text-center inline w-5 h-6 text-gray-800 text-sm" type="text" /> m&nbsp;
                        <input value={customTTB.s} onChange={(event) => { setTTB({ ...customTTB, s: event.target.value }) }} className="rounded text-center inline w-5 h-6 text-gray-800 text-sm" type="text" /> s&nbsp;
                        <div className="flex items-center justify-center mt-1 space-x-2">
                            <button onClick={updateChallenge.bind(this, challenge.segment_id)} className="h-6 w-6 inline text-lg bg-white text-gray-800 hover:bg-gray-100 hover:text-gray-900 shadow rounded px-2">✔</button>
                            <button onClick={() => { setEditing(false) }} className="h-6 w-6 inline bg-white text-gray-800 hover:bg-gray-100 hover:text-gray-900 shadow rounded px-2">
                                <svg className="h-4 w-4 -ml-1 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                        </div>
                        </span>
                    )
                    : (
                        <span className="text-xl font-bold">
                            {secsToTime(challenge.time_to_beat)} {canEdit ? <button className="text-sm bg-white hover:bg-gray-100 shadow rounded px-2 py-1" onClick={() => { setEditing(true) }}>✏️</button> : ''}
                        </span>
                    )
                }
                <span className="text-xs text-gray-600 font-medium">time to beat</span>
            </div>
            <div className="sm:w-2/12 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{ challenge.new_best ? secsToTime(challenge.new_best) : 'Not set yet' }</span>
                <span className="text-xs text-gray-600 font-medium">new best</span>
            </div>
            <div className="sm:w-2/12 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{ challenge.new_best ? Math.abs(((challenge.new_best-challenge.time_to_beat)/challenge.time_to_beat) * 100).toPrecision(3) : 'Not set yet' }</span>
                <span className="text-xs text-gray-600 font-medium">% improved</span>
            </div>
            {view}
            {remove}
        </div>
    )
}
