// takes in strList, which is a list of example strings.
// generates on a char basis, so it makes new words, not sentences
markovReadChars = function markovReadChars(strList, depth=2, delimiter="") {
  if (depth < 2) return;
  let markov = {}
  markov.starts = []


  strList.forEach(word => {
    let splitWord = word;
    if(delimiter) splitWord = splitWord.split(delimiter);
    splitWord += '@';
    markov.starts.push(splitWord.slice(0, depth));
    for (let i = 0; i < splitWord.length - depth; i++) {
      const chunk = splitWord.slice(i, i+depth);
      if (chunk in markov)
        markov[chunk].push(splitWord[i+depth]);
      else
        markov[chunk] = [splitWord[i+depth]];
    }
  });
  return markov;
}

markovGenerate = function markovGenerate(marObj, times, depth=2) {
  if (depth < 2) return;
  let words = [];
  let i = 0;
  let j = 0;
  while (j < times * 1000 && i < times) {
    j++;
    let next = ''
    const start = marObj.starts[Math.floor(Math.random() * marObj.starts.length)];;
    // console.log(start);
    if (start in marObj) {
      next = marObj[start][Math.floor(Math.random() * marObj[start].length)];;
    } else {
      continue;
    }
    let s = start + next;
    let k = s.slice(0,depth);
    while (k[depth-1] != '.') {
      // console.log('test');
      let temp = next;
      if (k in marObj) {
        next = marObj[k][Math.floor(Math.random() * marObj[k].length)];;
      } else {
        // s = "";
        break;
      }
      s += (next || '@');
      k = temp + next;
    }
    // depth + 1 is used because of the newline
    if (!!s && s.length > depth * 2 + 1) {
      words.push(s.slice(0,-1));
      i++;
    }
  }
  if (j >= times * 1000) {
    words.push("Failed after " + (times * 100).toString() + " times. Maybe try a bigger list of words?");
  }
  return words;
}

function replacePunctuation(corpus) {
  let re = /(\.|\?)/;
  return corpus.replace(re, "$1\n");
}

function gen(names, times=25, depth=2) {
  if (names.length === 0) return;
  let words = markovGenerate(markovReadChars(names, depth), times, depth);
  return words.join('\n');
}

// window.onload = function() {
//   document.getElementById("genButton").addEventListener("click", function(event) {
//       $("#generatedNames")[0].value = gen($("#names")[0].value.split('\n'), $("#times")[0].value);
//   }, false);
// }
