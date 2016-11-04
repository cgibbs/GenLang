function randFromArr(arr) {
  // -1 at the end for empty line at end of each file
  return arr[Math.floor(Math.random()*(arr.length-1))];
}

function generate(inp, times=1) {
  return new Promise((resolve, reject) => {
    let matches = inp.match(/%(.*?)%/g);
    let ret = [];

    for (let i = 0; i < times; i++) {
      let input = inp;
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
            error:   function() {i
              // An error occurred
              console.log("something died");
            }
          })
      }).then(() => ret.push(RandExp.randexp(input)));
    }
    resolve(ret);
  });
}

let test = "%40k_names%, of the (Order|Legion) of the %knightly_adjectives% %knightly_nouns%";

generate(test);

window.onload = function() {
  document.getElementById("genButton").addEventListener("click", function(event) {
      // $("#generatedNames")[0].value = generate($("#genString")[0].value, $("#times")[0].value);
      generate($("#genString")[0].value, $("#times")[0].value)
        .then(genArray => {
          console.log(genArray);
          $("#generatedNames")[0].value = genArray.join("\n");
        });
  }, false);
}
