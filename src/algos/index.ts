import { AppContext } from '../config'
import {
  QueryParams,
  OutputSchema as AlgoOutput,
} from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import * as biocosmism from './biocosmism'

type AlgoHandler = (
  ctx: AppContext,
  params: QueryParams,
  requesterDid?: string,
) => Promise<AlgoOutput>

const algos: Record<string, AlgoHandler> = {
  [biocosmism.shortname]: biocosmism.handler,
}

export default algos
