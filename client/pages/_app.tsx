import 'core-js/features/array/at'; // For Array.prototype.at
import 'core-js/features/promise/all-settled'; // For Promise.allSettled
import 'core-js/features/promise/with-resolvers'; // For Promise.withResolvers

import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp

