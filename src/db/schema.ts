export type DatabaseSchema = {
  post: Post
  preference: Preference
  sub_state: SubState
}

export type Post = {
  uri: string
  cid: string
  author: string
  text: string
  indexedAt: string
  tenets: string | null
}

export type Preference = {
  userDid: string
  subjectUri: string
  weight: number
  expiresAt: string
}

export type SubState = {
  service: string
  cursor: number
}
