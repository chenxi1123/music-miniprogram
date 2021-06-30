// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: 0,
    tab: 0,
    // 播放列表数据
    playlist: [{
      id: 1,
      title: '夜色斑斓了期待',
      singer: '三石阿',
      src: 'http://m801.music.126.net/20210411224128/8fe0d619e002d40c334c4dda2ac4226a/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/7693560161/592a/a975/2369/a0151e2cba89ec42554dbe21e08ca121.mp3://localhost:3000/1.mp3',
      coverImgUrl: 'https://img-nos.yiyouliao.com/inforec-20210630-0297e634f29010afa04825c4aaccc54b.jpg?time=1625040920&signature=DBE3241B43C9E75736670C69511558EA'
    }, {
      id: 2,
      title: '有一种悲伤',
      singer: 'Zkaaai',
      src: 'http://m801.music.126.net/20210411224128/8fe0d619e002d40c334c4dda2ac4226a/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/7693560161/592a/a975/2369/a0151e2cba89ec42554dbe21e08ca121.mp3',
      coverImgUrl: 'http://p1.music.126.net/RhL7UgxCAO0Srk4w7M2mqA==/109951166111007265.jpg?param=140y140'
    }, {
      id: 3,
      title: '敏感关系',
      singer: 'Zkaaai',
      src: 'http://localhost:3000/1.mp3',
      coverImgUrl: 'http://p1.music.126.net/yKwyqKyFvetwjxJoVFm_1Q==/109951165369274389.jpg?param=180y180'
    }, {
      id: 4,
      title: '不具名海岸',
      singer: '刘人语',
      src: 'http://localhost:3000/2.mp3',
      coverImgUrl: 'http://p1.music.126.net/kAskIicJ1_Mrc_oCQCM6dg==/109951163914511340.jpg?param=180y180'
    }, {
      id: 5,
      title: 'My Secret',
      singer: 'ADAMII',
      src: 'http://localhost:3000/2.mp3',
      coverImgUrl: 'http://p1.music.126.net/71twyQmli4W8dcX1fMX3tA==/18922595114558170.jpg?param=180y180'
    },{
      id: 6,
      title: 'Holy Grail (Adieu Remix)',
      singer: 'Adieu',
      src: 'http://localhost:3000/2.mp3',
      coverImgUrl: 'http://p1.music.126.net/s7Tmx_3ALWOShRuTfBRI0g==/109951163146714926.jpg?param=180y180'
    }
  ],
    state: 'paused',
    playIndex: 0,
    play: {
      currentTime: '00:00',
      duration: '00:00',
      percent: 0,
      title: '',
      singer: '',
      coverImgUrl: '/images/cover.jpg',
    }
  },

  // 页面切换
  changeItem: function(e) {
    this.setData({
      item: e.target.dataset.item,
    })
  },
  // tab切换
  changeTab: function(e) {
    this.setData({
      tab: e.detail.current
    })
  },

  // 实现播放器播放功能
  audioCtx: null,
  onReady: function() {
    this.audioCtx = wx.createInnerAudioContext()
    // 默认选择第1曲
    this.setMusic(0)
    var that = this
    // 播放进度检测
    this.audioCtx.onError(function() {
      console.log('播放失败：' + that.audioCtx.src)
    })
    // 播放完成自动换下一曲
    this.audioCtx.onEnded(function() {
      that.next()
    })
    // 自动更新播放进度
    this.audioCtx.onPlay(function() {})
    this.audioCtx.onTimeUpdate(function() {
      that.setData({
        'play.duration': formatTime(that.audioCtx.duration),
        'play.currentTime': formatTime(that.audioCtx.currentTime),
        'play.percent': that.audioCtx.currentTime / that.audioCtx.duration * 100
      })
    })
    // 格式化时间
    function formatTime(time) {
      var minute = Math.floor(time / 60) % 60;
      var second = Math.floor(time) % 60
      return (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
    }
  },
  // 音乐播放
  setMusic: function(index) {
    var music = this.data.playlist[index]
    this.audioCtx.src = music.src

    this.setData({
      playIndex: index,
      'play.title': music.title,
      'play.singer': music.singer,
      'play.coverImgUrl': music.coverImgUrl,
      'play.currentTime': '00:00',
      'play.duration': '00:00',
      'play.percent': 0
    })
  },

  // 播放按钮
  play: function() {
    
    this.audioCtx.play()
    this.setData({
      state: 'running'
    })
  },

  // 暂停按钮
  pause: function() {
    this.audioCtx.pause()
    this.setData({
      state: 'paused'
    })
  },

  // 下一曲按钮
  next: function() {
    var index = this.data.playIndex >= this.data.playlist.length - 1 ? 0 : this.data.playIndex + 1
    this.setMusic(index)
    if (this.data.state === 'running') {
      this.play()
    }
  },
  
  // 滚动条调节歌曲进度
  sliderChange: function(e) {
    var second = e.detail.value * this.audioCtx.duration / 100
    this.audioCtx.seek(second)
  },

  // 播放列表换曲功能
  change: function(e) {
    this.setMusic(e.currentTarget.dataset.index)
    this.play()
  }

})

