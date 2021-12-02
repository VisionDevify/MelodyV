import { getProviders, signIn } from 'next-auth/react'
import Image from 'next/image'
import Logo from '../public/images/mV.png'
import Head from 'next/head'

function Login({ providers }) {
    return (
        <div className="flex items-center flex-col bg-black min-h-screen w-full justify-center">
            <Head>
                <title>MelodyV</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Image className="w-52 mb-5" src={Logo} alt="MelodyV Logo"/>
            {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                    <button className="bg-[#18D860] text-white p-5 rounded-full" onClick={() => signIn(provider.id, {callbackUrl: '/'})}>Login With {provider.name}</button>
                </div>
            ))}
        </div>
    )
}

export default Login

export async function getServerSideProps() {
    const providers = await getProviders()
    return {
        props: {
            providers,
        }
    }
}