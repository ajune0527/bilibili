import { video } from './utils/video'
import { player } from './utils/player'
import CacheFactory from './utils/cache'
import Logger from './utils/logger'

class Check {

    constructor() {
        this.href = ''
        this.aid = ''
        this.cid = ''
        this.q = ''
        this.epid = ''
        this.locked = false
    }

    refresh() {
        if (this.locked) {
            return
        }
        this.lock = true
        Logger.debug('refresh...')
        $('#video_download').hide()
        $('#video_download_2').hide()
        player.recover_player()
        try {
            // 更新check
            this.href = location.href
            const vb = video.base()
            this.aid = vb.aid()
            this.cid = vb.cid()
            this.epid = vb.epid()
            this.q = video.get_quality().q
        } catch (err) {
            Logger.error(err)
        } finally {
            this.lock = false
        }
    }

}

export const check = new Check()
