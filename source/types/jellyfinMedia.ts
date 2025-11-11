export type JellyfinUserData = {
  PlayCount: number,
  LastPlayedDate: Date,
  Played: boolean,
}

export type JellyfinMedia = {
  Name: string,
  Id: string,
  IsFolder: false,
  Type: 'Movie'|'Episode'|'Series',
  UserData: JellyfinUserData,
  SeriesName: string|undefined,
  SeriesId: string|undefined,
  SeasonId: string|undefined,
}

export type JellyfinMediaSearchResult = {
  Items: JellyfinMedia[],
  TotalRecordCount: number
}