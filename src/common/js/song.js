import {getLyric} from '../../api/song'
import {ERR_OK} from '../../api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, imag, url}){
    this.id = id;
    this.midid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.imag = imag;
    this.url = url;
  }

	getLyric() {
		if (this.lyric) {
			return Promise.resolve(this.lyric)
		}

		return new Promise((resolve, reject) => {
			getLyric(this.mid).then((res) => {
				if (res.retcode === ERR_OK) {
					this.lyric = Base64.decode(res.lyric)
					resolve(this.lyric)
					console.log(this.lyric)
				} else {
					reject('no lyric')
				}
			})
		})
	}
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    imag: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    //url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=126548448`

  })
}

export function filterSinger(singer) {
  let ret = [];
  if(!singer){
    return ''
  }
  singer.forEach((item) => {
    ret.push(item.name)
  });
  return ret.join('/')
}
