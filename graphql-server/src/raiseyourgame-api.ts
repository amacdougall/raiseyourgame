import { RESTDataSource } from '@apollo/datasource-rest';
import Video from './interfaces/video.interface';
// TODO: say video.interface.js if the runtime squawks about it

type VideoResponseValue = {
  videos: Video[];
}

export default class RaiseYourGameAPI extends RESTDataSource {
  override baseURL = 'http://nodejs-server:5000';
  // override baseURL = 'http://localhost'; // when GraphQL is running outside Docker
  // TODO: switch standalone/docker behavior using env vars

  async getVideos(): Promise<Video[]> {
    return this.get<VideoResponseValue>('api/videos').then((data: VideoResponseValue) => {
      return data.videos;
    });
  }
}
