// console.log("Let's write javascript");

let songs;
let currfolder;
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder)
{
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }



  // show all the songs in palylist --
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> 
               <img class="invert" src="img/music.svg" alt="" />
               <div class="info">
                 <div>${song.replaceAll("%20", " ")}</div>
                 <div>punss</div>
               </div>
               <div class="playNow">
                 <span>Play Now</span>
                 <img class="invert" src="img/playsong.svg" alt="" />
               </div> </li>`;
  }

  // Attach an eventlistner to each song

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  return songs;
}


const playMusic = (track, pause = false) => {
  currentSong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}






async function displayAlbums(){
  let a = await fetch("http://127.0.0.1:3000/songs/");
let response = await a.text();
let div = document.createElement("div");
div.innerHTML = response;
let anchors  = div.getElementsByTagName("a")
let cardContainer = document.querySelector(".cardContainer")
let array = Array.from(anchors);
for(let index =  0 ; index < array.length; index++) {
  const e  = array[index];

  if (e.href.includes("/songs")) {
   
    let folder = e.href.split("/").slice(-2)[0];
    
    // get that meta data of the folder
    let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json/`);
    let response = await a.json();
    cardContainer.innerHTML =
      cardContainer.innerHTML +
      `<div  data-folder="${folder}" class="card">
 <div class="playButton">
   <svg
     data-encore-id="icon"
     role="img"
     aria-hidden="true"
     viewBox="0 0 24 24"
     class="Svg-sc-ytk21e-0 bneLcE"
     style="width: 40%; height: 40%"
   >
     <path
       d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"
     ></path>
   </svg>
 </div>
 <img src="/songs/${folder}/cover.jpeg" alt="" />
 <h2>${response.title}</h2>
 <p>${response.description}</p>
</div>`;
  }

  
};

// load the playlist whenevr card is clickedd--
Array.from(document.getElementsByClassName("card")).forEach((e) => {
  e.addEventListener("click", async (item) => {
    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
playMusic(songs[0])

  });
});



}










async function main() {
  // get the list of all the songs
  // songs  = await getSongs("songs/cs");
  await getSongs("songs/ncs");
  playMusic(songs[0], true);


// display aLL THE ALBUMS ON THE PAGE 

displayAlbums()





  // Attach an event listner to playbar buttons
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/playsong.svg";
    }
    // okay this is the basic code but i have to apply it when the song is played pura smjhaa
  });

  //  Listen for timeupdate event

  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime , currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      100 * (currentSong.currentTime / currentSong.duration) + "%";
  });

  // Add an event listner to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // add an eventlistner for hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });
 


  // add an eventlistner to close icon
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-130%";
  });

  // add an event listner to previous

  previous.addEventListener("click", () => {
    // console.log("previous clicked ");
    // console.log(currentSong.src);
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    if ([index - 1] >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // add an event listner to  next---

  next.addEventListener("click", () => {
    // console.log("next clicked ");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ([index + 1] < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
  

  // add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;


if(currentSong.volume>0){
  document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg" , "volume.svg")
}

    });

 
    // Add eventlistner to mute 
    document.querySelector(".volume>img").addEventListener("click" , e=>{

      if(e.target.src.includes("volume.svg")){
        e.target.src  = e.target.src.replace("volume.svg" ,"mute.svg");
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value =  0;
      }
      else if(document.querySelector(".volume input").addEventListener("click", ()=>{
        e.target.src = e.target.src.replace("mute.svg" ,"volume.svg");

      } )){

      }

      else {
        e.target.src  =    e.target.src.replace("mute.svg" , "volume.svg");
        currentSong.volume = 0.1;
        document.querySelector(".range").getElementsByTagName("input")[0].value =  10;

      }

    })


   

}

main();
 
 

