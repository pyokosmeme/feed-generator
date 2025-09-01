import { QueryParams } from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import { AppContext } from '../config'
import { Tenet } from '../biocosmism'

// shortname used when publishing the feed generator
export const shortname = 'biocosmism'

export const handler = async (
  ctx: AppContext,
  params: QueryParams,
  requesterDid?: string,
) => {
  let builder = ctx.db
    .selectFrom('post')
    .selectAll()
    .orderBy('indexedAt', 'desc')
    .limit(params.limit)

  if (params.cursor) {
    const timeStr = new Date(parseInt(params.cursor, 10)).toISOString()
    builder = builder.where('post.indexedAt', '<', timeStr)
  }

  const rows = await builder.execute()
  const now = Date.now()
  const feed = [] as { post: string; score: number }[]

  for (const row of rows) {
    let score = new Date(row.indexedAt).getTime()
    const tenets = row.tenets ? (row.tenets.split(',') as Tenet[]) : []
    if (tenets.length > 1) {
      score *= 1.5
    }
    if (requesterDid) {
      const pref = await ctx.db
        .selectFrom('preference')
        .select(['weight', 'expiresAt'])
        .where('userDid', '=', requesterDid)
        .where('subjectUri', '=', row.uri)
        .executeTakeFirst()
      if (pref && new Date(pref.expiresAt).getTime() > now) {
        score *= pref.weight
      }
    }
    feed.push({ post: row.uri, score })
  }

  feed.sort((a, b) => b.score - a.score)
  const slice = feed.slice(0, params.limit)

  let cursor: string | undefined
  const last = slice.at(-1)
  if (last) {
    const row = rows.find((r) => r.uri === last.post)
    if (row) {
      cursor = new Date(row.indexedAt).getTime().toString(10)
    }
  }

  return {
    cursor,
    feed: slice.map((s) => ({ post: s.post })),
  }
}
