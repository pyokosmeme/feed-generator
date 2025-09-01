import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'
import { SEED_TERMS, TENET_KEYWORDS, Tenet } from './biocosmism'

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return

    const ops = await getOpsByType(evt)

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)

    const postsToCreate = ops.posts.creates
      .filter((create) => {
        const text = create.record.text.toLowerCase()
        return SEED_TERMS.some((kw) => text.includes(kw.toLowerCase()))
      })
      .map((create) => {
        const text = create.record.text.toLowerCase()
        const tenets: Tenet[] = []
        for (const [tenet, kws] of Object.entries(TENET_KEYWORDS)) {
          if (kws.some((kw) => text.includes(kw.toLowerCase()))) {
            tenets.push(tenet as Tenet)
          }
        }
        return {
          uri: create.uri,
          cid: create.cid,
          author: create.author,
          text: create.record.text,
          indexedAt: new Date().toISOString(),
          tenets: tenets.length > 0 ? tenets.join(',') : null,
        }
      })

    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }
    if (postsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(postsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
  }
}
