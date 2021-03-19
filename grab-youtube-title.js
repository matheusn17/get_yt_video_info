var assert = require('assert')
var qs = require('querystring')
var https = require('https')

// Use your own Youtube API key. This one will expire soon.
var DEFAULT_KEY = "AIzaSyCpDOrNTgY6XAli7JbB8zvRngB-9Avn_C4"

//We first get the video ID to make things simple

//If video_url its not the link, it will do a search query and use the result to get a video to take the ID
//Try to put a search term instead of a url, it will return the first result from the search
function getVideoId(video_url, key, cb) {

    assert(typeof video_url === 'string', 'get-youtube-title: id must be string')
    assert(typeof key === 'string', 'get-youtube-title: key must be string')
    assert(typeof cb === 'function', 'get-youtube-title: callback must be a function')

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

        cb(null, json.items[0].id.videoId);

    }
}

//This one work only with ID
function getVideoTitle(id, key, cb) {

    assert(typeof id === 'string', 'get-youtube-title: id must be string')
    assert(typeof key === 'string', 'get-youtube-title: key must be string')
    assert(typeof cb === 'function', 'get-youtube-title: callback must be a function')

    var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + id + "&key=" + DEFAULT_KEY + ""

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

        //In fact, you can get any information from the video here
        //just chose what data to get from the video json info file
        //Here is the reference API:  https://developers.google.com/youtube/v3/docs/videos
        cb(null, json.items[0].snippet.title, json.items[0].snippet.description);

    }
}

//Using the callback to print the value
//get the link from the 2nd argument
getVideoId(process.argv[2], DEFAULT_KEY, function(err, id) {
    if (id) {
        getVideoTitle(id, DEFAULT_KEY, function(err, title, description) {
            console.log(title, description);
        })
    } else {
        console.log(err);
    }
});