import dotenv from 'dotenv'
dotenv.config()

/** Fetches JSON from an NYT games endpoint as the signed-in subscriber, failing loudly on any error. */
export async function fetchNyt<T>(
  /** Path on www.nytimes.com, starting with /svc/ */
  path: string,
): Promise<T> {
  const cookie = process.env.NYT_S_COOKIE
  if (!cookie) throw new Error('NYT_S_COOKIE is not set. Add the NYT-S cookie from nytimes.com to ~/.secrets.')

  const response = await fetch(`https://www.nytimes.com${path}`, {
    headers: { cookie: `NYT-S=${cookie}`, 'user-agent': userAgent },
  })

  if (response.status === 401 || response.status === 403)
    throw new Error('NYT rejected the NYT-S cookie. It has probably expired; copy a fresh one into ~/.secrets.')
  if (!response.ok) throw new Error(`NYT returned ${response.status} for ${path}: ${(await response.text()).slice(0, 200)}`)

  return response.json()
}

const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
