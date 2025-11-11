import ky, { KyInstance } from 'ky';
import { JellyfinUser } from '../types/jellyfinUser.js';
import { JellyfinMediaSearchResult } from '../types/jellyfinMedia.js';
import config from '../config.js';

export default class MainService {
  private static jellyfinUrl = config.jellyfinUrl;

  private static kyy: KyInstance = ky.create(
    {
      headers : {
        "Authorization": `MediaBrowser Token="${config.jellyfinApiKey}"`,
        "Content-Type": "application/json"
      }
    }
  )

  public static async getUsers(): Promise<JellyfinUser[]> {
    const users = this.kyy.get(`${this.jellyfinUrl}/Users`).json<JellyfinUser[]>();
    return users;
  }

  public static async getUserMedias(userId: string): Promise<JellyfinMediaSearchResult> {
    const users = this.kyy.get(`${this.jellyfinUrl}/Items`, {
      searchParams: {
        userId: userId,
        recursive: true,
        includeItemTypes: 'Movie,Episode',
        isPlayed: true,
        sortOrder: 'Descending',
        sortBy: 'PlayCount',
        enableUserData: true,
      }
    }).json<JellyfinMediaSearchResult>();
    return users;
  }
}