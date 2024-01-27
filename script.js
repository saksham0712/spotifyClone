

let currentSong = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`./${folder}/`)
    let response = await a.text()

    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a')

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
    // show all the songs in the playlists
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                           <div class="info">
                               <div>${song.replaceAll("%20", " ")}</div>
                               <div>hero</div>
                           </div>
                           <div class="playnow">
                               <span>Play now</span>
                               <img src="img/play.svg" class="invert" alt="">
                           </div></li>`;
    }

    // attach a event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })

    })
}
const playMusic = (track, pause = false) => {
    //   let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
    }
    // currentSong.play()
    play.src = "img/pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums(){
    let a = await fetch(`./songs/`)
    let response = await a.text()

    let div = document.createElement('div')
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0]
            // get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json()
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}"  class="cards">
            <div class="play">

                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 4 24 24"
                    fill="black" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#000000">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="#000000" stroke-width="1.5" stroke-linejoin="round"></path>
                </svg>
            </div>  

            <img src="/songs/${folder}/cover.jpg" alt="lofi beats">
            <h2>${response.title}</h2>
            <p>${response.description} </p>
        </div>`
        }
    }
    Array.from(document.getElementsByClassName("cards")).forEach(e => {


        e.addEventListener("click", async item => {



            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    })
    
}
async function main() {
console.log('main function is called')
    // get the songs list of the songs
    await getSongs("songs/downloaded");
    playMusic(songs[0], true)


// display all the albums
displayAlbums()
    //attach an event listener to play pause and nxt buttons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        } else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    // liste for time update event

    currentSong.addEventListener("timeupdate", () => {
        let currentTime = currentSong.currentTime
        let totalTime = currentSong.duration
        let min = Math.floor(currentTime / 60)       // this is a code of the AI
        let sec = currentTime - min * 60
        let min2 = Math.floor(totalTime / 60)
        let sec2 = totalTime - min2 * 60
        document.querySelector(".songtime").innerHTML = `${min}:${sec.toFixed(0)} / ${min2}:${sec2.toFixed(0)}`

        let ab = document.querySelector(".circle").style.left = (currentTime / totalTime) * 100 + "%"


    })
    // add an event listener for the seek bar
    document.querySelector('.seekbar').addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //add a event listener for hamburger
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector(".left").style.left = "0"
    })

    //add a event listener for close
    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector(".left").style.left = "-400px"
    })
    // adding now event listener for the preivous and next track
    previous.addEventListener('click', () => {

        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }

    })
    next.addEventListener('click', () => {


        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }



    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        currentSong.volume = parseInt(e.target.value) / 100

    })
    // add event listenr to the volume range to mute the player
    document.querySelector(".volume>img").addEventListener("click", (e)=>{console.log(e.target)
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg") 
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            currentSong.volume = .10;
            e.target.src = e.target.src.replace("mute.svg", "volume.svg") 
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;

        }
    })
    

}
main()
