import express from 'express'
import { AppContext } from '../config'
import { validateAuth } from '../auth'

export default function (app: express.Application, ctx: AppContext) {
  app.post('/preferences', express.json(), async (req, res) => {
    let requesterDid: string
    try {
      requesterDid = await validateAuth(req, ctx.cfg.serviceDid, ctx.didResolver)
    } catch (err) {
      res.status(401).send({ error: 'invalid token' })
      return
    }
    const { subjectUri, preference } = req.body as {
      subjectUri?: string
      preference?: 'show-more' | 'show-less'
    }
    if (!subjectUri || !preference) {
      res.status(400).send({ error: 'subjectUri and preference required' })
      return
    }
    const weight = preference === 'show-more' ? 2 : 0.5
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString() // 60 days
    await ctx.db
      .insertInto('preference')
      .values({ userDid: requesterDid, subjectUri, weight, expiresAt })
      .onConflict((oc) =>
        oc
          .columns(['userDid', 'subjectUri'])
          .doUpdateSet({ weight, expiresAt }),
      )
      .execute()
    res.status(200).send({ ok: true })
  })
}
