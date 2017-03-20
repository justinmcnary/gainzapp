const appID = '5ff9d9d1';
const appKey = '8a580ee40ddee9e24cc9c02664aced07';

const state = {
  weight: 0,
  sex: "",
  calCountSustain: 2000,
  calCountGain: 2000,
  calCountLose: 2000,
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
}

const removeItem = function(state, iRemoving) {
  let normalizeRemoving = iRemoving.trim().toLowerCase();
  state.storedItems.map(function(item, i){
    let normalizeName = item.itemName.trim().toLowerCase();
    if(normalizeName === normalizeRemoving){
      state.storedItems.splice(i, 1);
    }
  })
}

const userInputs = function(weight, sex) {
  state.weight = weight;
  state.sex = sex;
  if (sex === "female") {
    state.calCountSustain = 10 * weight;
    state.calCountGain = (10 * weight) + 300;
    state.calCountLose = (10 * weight) - 300;
  }
  else {
    state.calCountSustain = 11 * weight;
    state.calCountGain = (11 * weight) + 500;
    state.calCountLose = (11 * weight) - 500;
  }
  displayUserCal();
}

const displayUserCal = function() {
  $('.js-user').append(
    `<div class= 'userStats'>
    <p>Suggested Calorie intake to Sustain Weight: ${state.calCountSustain}</p>
    <p>Suggested Calorie intake to Gain Weight: ${state.calCountGain}</p>
    <p>Suggested Calorie intake to Lose Weight: ${state.calCountLose}</p>`
  )
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
    let sex = $('input[name=gender]:checked', '.sex').val();
    userInputs(weight, sex);
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


//Calorie Counter//
