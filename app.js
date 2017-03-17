const appID = '5ff9d9d1';
const appKey = '8a580ee40ddee9e24cc9c02664aced07';

const state = {
  weight: 0,
  lbm: 0,
  age: 0,
  calorieGoal: 2000,
  searchItems: [],
  storedItems: []
}


function getFoodFromApi(query){
  $.getJSON(`https://api.nutritionix.com/v1_1/search/${query}?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat&appId=5ff9d9d1&appKey=8a580ee40ddee9e24cc9c02664aced07`, (d)=>{
    state.searchItems = d.hits;
    displayResults();
  });

};

const addItem = function(state, itemName, cal) {
  let itemObj = {itemName, cal};
  state.storedItems.push(itemObj);
  // console.log(state);
}

const removeItem = function(state, iRemoving) {
  //state.storeditems loop
  // string.trim()
  //string.toLowerCase()
  //if items.name === item
  //return item
  let normalizeRemoving = iRemoving.trim().toLowerCase();
  state.storedItems.map(function(item, i){
    let normalizeName = item.itemName.trim().toLowerCase();
    if(normalizeName === normalizeRemoving){
      state.storedItems.splice(i, 1);
    }
  })
}

const userInputs = function(weight, lbm) {
  state.weight = weight;
  state.lbm = lbm;
}


const displayTodaysMenu = function() {
  $('.js-todays-meals').html("");
  state.storedItems.map(function(item) {
  $('.js-todays-meals').append(
    `<div class= "mealBar">
     <p class"iName">${item.itemName}</p>
     <p class"iCal">${item.cal}</p>
     <button class= "delete"> Delete </button>
     </div>`)
  });
}

const displayResults = function() {
  $('.js-search-results').html("");
  state.searchItems.map(function(item) {
  let items = item.fields;
  $('.js-search-results').append(
    `<div class= "itemBar">
     <h2 class= "title"> ${items.brand_name} ${items.item_name}</h2>
     <p class= "calories"> Calories: ${items.nf_calories} </p>
     <p> Serving Size: ${items.nf_serving_size_qty} ${items.nf_serving_size_unit} </p>
     <p> Total Fat: ${items.nf_total_fat} </p>
     <button class= "select"> Select </button>
     </div>`)
  });
}

function watchSubmit() {
  $('.js-search-form').submit(function(e) {
    e.preventDefault();
    let query = $(this).find('.js-query').val();
    getFoodFromApi(query);
  });
}
  $('.setup').submit(function(e) {
    e.preventDefault;
    let weight = $(this).find('.weight').val();
    let lbm = $('.lbm').val();
    userInputs(weight, lbm);
  });

$('.flexcontainer').on('click','.select', function(){
  addItem(state, 
  $(this).closest('div').find('.title').text(),
  $(this).closest('div').find('.calories').text());
  displayTodaysMenu();
});

$('.flexcontainer').on('click', 'button.delete', function(event){
  removeItem(state, $(this).closest('div').children().eq(0).text());
  displayTodaysMenu();
});

$('.startpage').on('click', 'button.next', function(event){
  $('header').removeClass('hidden');
  $('.startpage').addClass('hidden');
});

watchSubmit();
