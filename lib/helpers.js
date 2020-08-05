const secsToTime = (secs) => {
    secs = Number(secs)
    const h = Math.floor(secs / 3600)
    const m = Math.floor(secs % 3600 / 60)
    const s = Math.floor(secs % 3600 % 60)

    const hDisplay = h > 0 ? h + 'h, ' : ""
    const mDisplay = m > 0 ? m + 'm, ' : ""
    const sDisplay = s > 0 ? s + 's' : ""
    const display = hDisplay + mDisplay + sDisplay
    return display.slice(-2) !== ', ' ? display : display.slice(0, -2)
}

export { secsToTime }