const appID = '5ff9d9d1';
const appKey = '8a580ee40ddee9e24cc9c02664aced07';

function getFood(query){
  $.getJSON(`https://api.nutritionix.com/v1_1/search/${query}?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat&appId=5ff9d9d1&appKey=8a580ee40ddee9e24cc9c02664aced07`, (d)=>{
    console.log(d);
    let result = {
      Food: d.hits["0"].fields.item_name,
      Calories: d.hits["0"].fields.nf_calories
    };
    console.log(result);
  });
};


function watchSubmit() {
  $('.js-search-form').submit(function(e) {
    e.preventDefault();
    let query = $(this).find('.js-query').val();
    console.log(query);
    getFood(query);
  });
}

watchSubmit();




// function eventListner() {
//   $('#search-bar').submit(function(e){
//     e.preventDefault();
//     searchValue();  
//   })
// }

// eventListner();
// function getDataFromApi(searchTerm, callback) {
//   var query = {
//     "appId": appID,
//     "appKey": appKey,
//     "query": "Cookies `n Cream"
//   }
//   $.getJSON(url, query, callback);
// }

// getDataFromApi();
