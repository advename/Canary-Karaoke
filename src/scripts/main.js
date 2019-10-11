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
      songData.groups.push({
        group_duration: 0, //the whole duration of each group
        group: groupOfWords, //each word, length, start time and tone
        group_start: 0, //the start of each group (gaps included)
        group_end: 0, //the end of each group (gaps included)
        group_gap_start: 0, //the allowed gap before the first word of this group
        group_gap_end: 0 //the allowed gap before the end of this group
      }); //add group of words to the songData array
      groupOfWords = [];
    }
  });

  //Combine song data and meta data
  songData = { ...songData, ...songMetaData };

  songData.groups.forEach((group, i) => {
    const currentGroup = group.group;
    const currentGroupLast = currentGroup[currentGroup.length - 1];
    //Add group_gap_start and group_gap_end for all else groups
    if (i == 0) {
      const nextGroup = songData.groups[i + 1].group;
      const group_gap_start = currentGroupLast.time - 0;
      const group_gap_end =
        (nextGroup[0].time -
          (currentGroupLast.time + currentGroupLast.length)) /
        2;
      const group_duration =
        group_gap_start +
        group_gap_end +
        (currentGroupLast.time +
          currentGroupLast.length -
          currentGroup[0].time);

      const group_end =
        currentGroupLast.time + currentGroupLast.length + group_gap_end;
      const group_start = 0;
      //Update song data
      songData.groups[i].group_gap_start = group_gap_start;
      songData.groups[i].group_gap_end = group_gap_end;
      songData.groups[i].group_duration = group_duration;
      songData.groups[i].group_end = group_end;
      songData.groups[i].group_start = group_start;
    } else if (i == songData.groups.length - 1) {
      const prevGroup = songData.groups[i - 1].group;

      const group_gap_start =
        (currentGroup[0].time -
          (prevGroup[prevGroup.length - 1].time +
            prevGroup[prevGroup.length - 1].length)) /
        2;

      const group_gap_end =
        group.group_end - currentGroupLast.time + currentGroupLast.length;
      const group_duration =
        group_gap_start +
        group_gap_end +
        (currentGroupLast.time +
          currentGroupLast.length -
          currentGroup[0].time);
      const group_end =
        currentGroupLast.time + currentGroupLast.length + group_gap_end;
      const group_start = currentGroup[0].time - group_gap_start;
      //Update song data
      songData.groups[i].group_gap_start = group_gap_start;
      songData.groups[i].group_gap_end = group_gap_end;
      songData.groups[i].group_duration = group_duration;
      songData.groups[i].group_end = group_end;
      songData.groups[i].group_start = group_start;
    } else {
      const prevGroup = songData.groups[i - 1].group;
      const nextGroup = songData.groups[i + 1].group;
      const group_gap_start =
        (currentGroup[0].time -
          (prevGroup[prevGroup.length - 1].time +
            prevGroup[prevGroup.length - 1].length)) /
        2;
      const group_gap_end =
        (nextGroup[0].time -
          (currentGroupLast.time + currentGroupLast.length)) /
        2;
      const group_duration =
        group_gap_start +
        group_gap_end +
        (currentGroupLast.time +
          currentGroupLast.length -
          currentGroup[0].time);
      const group_end =
        currentGroupLast.time + currentGroupLast.length + group_gap_end;
      const group_start = currentGroup[0].time - group_gap_start;
      //Update song data
      songData.groups[i].group_gap_start = group_gap_start;
      songData.groups[i].group_gap_end = group_gap_end;
      songData.groups[i].group_duration = group_duration;
      songData.groups[i].group_end = group_end;
      songData.groups[i].group_start = group_start;
    }
  });
  console.log(songData.groups);
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
      return o.group_duration;
    })
  );

  songData.groups.forEach((group, i) => {
    let groupCanvas = document.createElement("canvas");
    groupCanvas.className = "pitch-group";
    groupCanvas.width = group.group_duration;
    groupCanvas.height = 200;
    let ctx = groupCanvas.getContext("2d");
    const groupStartPoint = group.group_start;
    group.group.forEach(word => {
      if (i == 0) {
        const startPoint = word.time;
        const length = word.length;
        console.log(
          "Size: " +
            group.group_duration +
            ", Start :" +
            startPoint +
            ", Length: " +
            length
        );
        createSinglePitch(ctx, startPoint, length, word.tone);
      } else {
        const startPoint = word.time - groupStartPoint;
        const length = word.length;
        console.log(
          "Size: " +
            group.group_duration +
            ", Start :" +
            startPoint +
            ", Length: " +
            length
        );
        createSinglePitch(ctx, startPoint, length, word.tone);
        // ctx.fillStyle = "red";
        // ctx.fillRect(startPoint, word.tone * 10, length, 100);
      }
    });
    pitchTrackContainer.appendChild(groupCanvas);
  });
}

function createSinglePitch(ctx, start, length, tone) {
  ctx.fillStyle = "red";
  ctx.fillRect(start, tone * 10, length, tone * 10 - 10);
}

//Convert beats to time in miliseconds
function convertBeatToTime(bpm, beat) {
  return Math.floor((beat / (4 * bpm)) * 60 * 1000);
}

let xbpm = 400;
let xbeat_duration = 1 / (xbpm / 60);
let seconds = 60;

function secondToBeats(seconds) {
  let beat_pos = seconds / xbeat_duration;
  return Math.floor(beat_pos + xbeat_duration / 2);
}
let beat_number = secondToBeats(60);
console.log(beat_number);

// function convertBeatToTime(bpm, beat) {
//   const beat_duration = 1 / (bpm / 60);
//   return Math.floor((beat_duration * beat * 1000) / 4);
// }
