export type JellyfinUserData = {
  PlayCount: number,
  LastPlayedDate: Date,
  Played: boolean,
}

export type JellyfinMedia = {
  Name: string,
  Id: string,
  IsFolder: false,
  Type: 'Movie'|'Episode',
  UserData: JellyfinUserData
}

export type JellyfinMediaSearchResult = {
  Items: JellyfinMedia[],
  TotalRecordCount: number
}