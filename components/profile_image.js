export default function ProfileImage({ image, ...props }) {
    const realUrl = image === 'avatar/athlete/large.png'
        ? `/default-user.png`
        : image

    return (
        <img className={`${props.className} rounded-full`} src={realUrl} />
    )
}