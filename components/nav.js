import Link from 'next/link'
import ProfileImage from './profile_image'
import { signIn, signOut, useSession } from 'next-auth/client'

export default function Nav({ home }) {
  const [ session ] = useSession()

  return (
    <nav className="border-b-2 border-gray-400 topo">
      <ul className="flex justify-between items-center p-6">
        {!home ? (
          <li>
            <Link href="/">
              <a className="bg-gray-100 hover:bg-white px-2 sm:px-4 py-2 text-gray-800 rounded-lg shadow-sm no-underline font-bold">🏠 <span className="hidden sm:inline"> Home</span></a>
            </Link>
          </li>
        ) : <li></li> }

        {/* {menu.length ? {} : <li></li> } */}
        <ul className="flex justify-between items-center space-x-4">
          {!session && <>
            <li><span className="hidden sm:inline italic">You are not signed in</span></li>
            <li><a
                href={`/api/auth/signin`}
                className="bg-white rounded-lg shadow-base text-gray-700 font-bold px-4 py-2 hover:bg-orange-700 hover:text-white"
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                Sign in 🔐
              </a></li>
          </>}
          {session && <>
            <Link href="/u/[name]" as={`/u/${session.user.name}`}>
              <a className="flex">
                <div className="flex items-center mr-2">
                  <ProfileImage image={session.user.image} className="hidden sm:inline h-8 w-8 cursor-pointer" />
                </div>
                <div>
                  <small>Signed in as</small><br/>
                  <strong>{session.user.name}</strong>
                </div>
              </a>
            </Link>
            <a
                href={`/api/auth/signout`}
                className="bg-white rounded-lg shadow-base text-gray-700 font-bold px-4 py-2 hover:bg-orange-600 hover:text-white"
                onClick={(e) => {
                  e.preventDefault()
                  signOut()
                }}
              >
                Sign out ✌️
              </a>
          </>}
        </ul>
      </ul>
    </nav>
  )
}
