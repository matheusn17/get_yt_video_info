
function getVideoInfo(video_url, key, cb) {

    assert(typeof video_url === 'string', 'get-youtube-title: id must be string')
    assert(typeof key === 'string', 'get-youtube-title: key must be string')
    assert(typeof cb === 'function', 'get-youtube-title: callback must be a function')

    //format the url string
    var url = "https://www.googleapis.com/youtube/v3/search/?part=snippet&q=" + video_url + "&key=" + DEFAULT_KEY + ""

    https.request(url, onrequest).end()

    function onrequest(res) {
        var data = ''
        res.on('data', ondata)
        res.on('end', onend)
        res.on('error', cb)

        function ondata(chunk) {
            data += chunk
        }

        function onend() {
            try {
                var json = JSON.parse(data)
            } catch (err) {
                return cb(err)
            }
            onresponse(json)
        }
    }

    function onresponse(json) {
        if (json.error)
            return cb(json.error)
        if (json.items.length === 0)
            return cb(new Error('Not found'))
        //decide what data to get
        cb(null, json.items[0].id.videoId);

    }
}
