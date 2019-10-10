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
  let songMetaData = {};
  let songMetaDataTemp = splitedText.filter(function(line) {
    return line.indexOf("#") == 0;
  });

  songMetaDataTemp.forEach(meta => {
    let key = meta.substr(1, meta.indexOf(":") - 1).toLowerCase();
    let value = meta
      .substr(meta.indexOf(":") + 1, meta.length - meta.indexOf(":"))
      .trim();
    if (key == "bpm") {
      value = parseInt(value.replace(",", "."));
    } else {
    }
    songMetaData[key] = value;
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
        time: convertBeatToTime(songMetaData.bpm, filteredLineArrayData[1]),
        length: convertBeatToTime(songMetaData.bpm, filteredLineArrayData[2]),
        tone: filteredLineArrayData[3],
        word: filteredLineArrayData[4]
      };
      groupOfWords.push(wordData);
    } else {
      const groupEnd = convertBeatToTime(
        songMetaData.bpm,
        filteredLineArrayData[1]
      );
      const groupDuration = groupEnd - groupOfWords[0].time;

      songData.groups.push({
        group_beat_length: groupDuration,
        group: groupOfWords,
        group_end: groupEnd
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
  const pitchTrackContainer = document.querySelector(
    "#pitch-track .canvas-container"
  );
  let fragment = document.createDocumentFragment();
  let maxGroupLength = Math.max.apply(
    Math,
    songData.groups.map(function(o) {
      return o.group_beat_length;
    })
  );

  songData.groups.forEach((group, i) => {
    let groupCanvas = document.createElement("canvas");
    groupCanvas.className = "pitch-group";
    groupCanvas.width = group.group_beat_length;
    groupCanvas.height = 200;
    pitchTrackContainer.appendChild(groupCanvas);
    let ctx = groupCanvas.getContext("2d");
    group.group.forEach(word => {
      if (i == 0) {
        const startPoint = word.time;
        const length = word.length;
        console.log(
          "Size: " +
            group.group_beat_length +
            ", Start :" +
            startPoint +
            ", Length: " +
            length
        );
        ctx.fillStyle = "red";
        ctx.fillRect(startPoint, 50, length, 100);
      } else {
        const startPoint = group.group_end - word.time - word.length;
        const length = word.length;
        console.log(
          "Size: " +
            group.group_beat_length +
            ", Start :" +
            startPoint +
            ", Length: " +
            length
        );
        ctx.fillStyle = "red";
        ctx.fillRect(startPoint, 50, length, 100);
      }
    });
  });
  // pitchTrackContainer.appendChild(fragment);
}

//Convert beats to time in miliseconds
// function convertBeatToTime(bpm, beat) {
//   return Math.ceil((beat / (4 * bpm)) * 60 * 1000);
// }

let xbpm = 400;
let xbeat_duration = 1 / (xbpm / 60);
let seconds = 60;

function secondToBeats(seconds) {
  let beat_pos = seconds / xbeat_duration;
  return Math.floor(beat_pos + xbeat_duration / 2);
}
let beat_number = secondToBeats(60);
console.log(beat_number);

function convertBeatToTime(bpm, beat) {
  const beat_duration = 1 / (bpm / 60);
  return Math.floor(beat_duration * beat * 1000);
}
