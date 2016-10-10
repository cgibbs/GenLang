function randFromArr(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}

function generate(input) {
  let matches = input.match(/%(.*?)%/g);

  Promise.map(matches, match => {
    let slice_index = -1;
    let succ = text => {
      // non-Markov success function
      input = input.replace(match, randFromArr(text.split('\n')).slice(0, -1));
    }

    if(match.endsWith('_mar%')) {
      succ = text => {
        input = input.replace(match, gen(text.split('\n'), 1).slice(0, -1));
      }
      slice_index = -5;
    }
      return $.ajax("javascripts/lists/" + match.slice(1, slice_index) + ".txt", {
        type:    "GET",
        success: succ,
        error:   function() {
          // An error occurred
          console.log("something died");
        }
      })
  }).finally(() => console.log(input));
}

let test = "%40k_names%, of the Order of the %knightly_adjectives% %knightly_nouns%";

generate(test);