import { RESTDataSource } from '@apollo/datasource-rest';
import Video from './interfaces/video.interface';
// TODO: say video.interface.js if the runtime squawks about it

export default class RaiseYourGameAPI extends RESTDataSource {
  override baseURL = 'http://nodejs-server:5000/api';

  async getVideos(): Promise<Video[]> {
    return this.get<Video[]>('videos');
  }
}
