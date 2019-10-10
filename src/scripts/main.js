/* ==========================================================================
   Global variables
   ========================================================================== */
const body = document.querySelector("body");

/* ==========================================================================
   Initialize
   ========================================================================== */
document.addEventListener("DOMContentLoaded", init);
function init() {
  //do stuff after page has loaded
  fetchSongFile();
}

/* ==========================================================================
   Functions
   ========================================================================== */

//Fetch the song file and save it
function fetchSongFile() {
  fetch(
    "songs/Backstreet%20Boys%20-%20Want%20it%20that%20way/Backstreet%20Boys%20-%20Want%20it%20that%20way.txt"
  )
    .then(response => response.text())
    .then(text => {
      readSongData(text);
    });
}

let songData = { groups: [] }; //contains the songdata used for the karaoke

//read the song data so it can later be used for displaying
function readSongData(text) {
  //Split the text file into an array
  let splitedText = text.split("\n");

  //Get song meta data and save it to songMetaData object
  let songMetaDataTemp = splitedText.filter(function(line) {
    return line.indexOf("#") == 0;
  });
  let songMetaData = {};

  songMetaDataTemp.forEach(meta => {
    let key = meta.substr(1, meta.indexOf(":") - 1);
    let value = meta
      .substr(meta.indexOf(":") + 1, meta.length - meta.indexOf(":"))
      .trim();
    songMetaData[key.toLowerCase()] = value;
  });

  // Get all lines of songs with beats, tone, length and the word, combine together belonging words in a group and add it to song data
  let linesData = splitedText.filter(function(line) {
    return line.indexOf("#") != 0;
  });

  //Save each line as an object in an array
  let groupOfWords = [];
  linesData.forEach(lineData => {
    lineArrayData = lineData.split(/\s/);
    filteredLineArrayData = lineArrayData.filter(function(str) {
      return /\S/.test(str);
    });

    let wordData = {};

    //Belongs to the current group of words
    if (filteredLineArrayData[0] != "-") {
      wordData = {
        type: filteredLineArrayData[0],
        beat: filteredLineArrayData[1],
        length: filteredLineArrayData[2],
        tone: filteredLineArrayData[3],
        word: filteredLineArrayData[4]
      };
      groupOfWords.push(wordData);
    } else {
      const groupDuration =
        groupOfWords[groupOfWords.length - 1].beat - groupOfWords[0].beat;
      songData.groups.push({
        group_beat_length: groupDuration,
        group: groupOfWords
      }); //add group of words to the songData array
      groupOfWords = [];
    }
  });

  //Combine song data and meta data
  songData = { ...songData, ...songMetaData };
  console.log(songData);
  createKaraokeScreen();
}

//Create the karaoke screen based on songData
function createKaraokeScreen() {
  const pitchCanvasContainer = document.querySelector(
    "#pitch-canvas .container"
  );
  let fragment = document.createDocumentFragment();

  songData.groups.forEach(group => {
    // console.log(group);
    // if (group[0][0]) {
    // }
  });

  // while (i < 200) {
  //   el = document.createElement("li");
  //   el.innerText = "This is my list item number " + i;
  //   fragment.appendChild(el);
  //   i++;
  // }

  // div;

  // pitchCanvas.setAttribute();
  // var ctx = pitchCanvas.getContext("2d");
  // ctx.fillStyle = "#FF0000";
  // ctx.fillRect(0, 0, 150, 75);

  // pitchCanvasContainer.appendChild(fragment);
}
