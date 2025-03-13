import { lstatSync, writeFile } from 'node:fs';
import * as fs from 'node:fs/promises';
import readline from 'readline';

headers = new Headers()
headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 YaBrowser/25.2.0.0 Safari/537.36')
headers.append('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7')

function get_api_url(video_id) {
  return 'https://rutube.ru/api/play/options/' + video_id + '/?no_404=true&referer=https%3A%2F%2Frutube.ru'
}

function get_data(url) {
    fetch(url, {
        method: "GET",
        headers: headers
    })
    .then((response) => response.json())
    .then((videoData) => {
      videoAuthor = videoData['author']['name']
      videoTitle = videoData['title']

      dictRepl = ["/", "\\", "[", "]", "?", "'", '"', ":", "."]
      dictRepl.forEach(repl => {
          if (videoTitle.includes(repl))
            videoTitle = videoTitle.replace(repl, "")
          if (videoAuthor.includes(repl))
            videoAuthor = videoAuthor.replace(repl, "")
      })
      videoTitle = videoTitle.replace(" ", "_")
      videoAuthor = videoAuthor.replace(" ", "_")
      video_m3u8 = videoData['video_balancer']['m3u8']
      return [videoAuthor, videoTitle, video_m3u8]
    })
}


function get_link_from_m3u8(url_m3u8) {
  if (!lstatSync('seg').isDirectory())
    mkdir('seg')
  // req_out = chrome.storage.local.get("pl_list", req_out)
  req_out = null
  req = fetch(url_m3u8, {
    method: "GET",
    headers: headers
  }).then((res) => req_out = res.text())
  data_m3u8_list = []
  writeFile('seg\\pl_list.txt', req_out)
  src = readFile('seg\\pl_list.txt').toString().split('\n')
  // chrome.storage.local.set("pl_list", req_out)
  // with open('seg\\pl_list.txt', 'r', encoding='utf-8') as file:
  //     src = file.readlines()

  src.forEach(item => {
    data_m3u8_dict.append(item)
  })

  url_playlist = data_m3u8_dict[-1]
  alert(url_playlist)
  return url_playlist
}

url = get_api_url(document.URL.split('/')[4])
get_data(url)
