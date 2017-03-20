const appID = '5ff9d9d1';
const appKey = '8a580ee40ddee9e24cc9c02664aced07';

const state = {
  weight: 0,
  sex: "",
  calCountSustain: 2000,
  calCountGain: 2000,
  calCountLose: 2000,
  todaysCalIntakeTotal: 0,
  todaysCalIntake: [],
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
  let numCal = cal.replace ( /[^0-9.]/g, '' );
  state.todaysCalIntake.push(+numCal);
  // state.todaysCalIntakeTotal = state.todaysCalIntake.reduce(add, 0);
  // function add (a,b) {
  //   return a + b;
  //}
}

const calculateCal = function(state){
  console.log(state);
  state.todaysCalIntakeTotal = state.todaysCalIntake.reduce(add, 0);
  function add (a,b) {
    return a + b;
  }
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

const removeCal = function(state, calCount) {
  state.todaysCalIntake.map(function(item, i){
    console.log(calCount);
    console.log(item);
    if (item === calCount) {
      console.log("matched cal count", calCount);
      state.todaysCalIntake.splice(i,1);
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
  $('.js-user').html("");
  $('.js-user').append(
    `<div class= 'userStats'>
    <p>Suggested Calorie intake to Sustain Weight: ${state.calCountSustain}</p>
    <p>Suggested Calorie intake to Gain Weight: ${state.calCountGain}</p>
    <p>Suggested Calorie intake to Lose Weight: ${state.calCountLose}</p>
    <p>Todays Caloric Intake: ${state.todaysCalIntakeTotal}</p>`
  )
}

const calculateCalIntake = function(cal) {
  console.log(cal);
  state.todaysCalIntake = state.todaysCalIntake + cal;
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
  calculateCal(state);
  displayTodaysMenu();
  displayUserCal();
});

$('.flexcontainer').on('click', 'button.delete', function(event){
  removeItem(state, $(this).closest('div').children().eq(0).text());
  let calDelete = $(this).closest('div').children().eq(1).text();
  let numCal = calDelete.replace( /[^0-9.]/g, '' );
  removeCal(state, +numCal);
  calculateCal(state);
  displayTodaysMenu();
  displayUserCal();
});

$('.startpage').on('click', 'button.next', function(event){
  $('header').removeClass('hidden');
  $('.startpage').addClass('hidden');
});

watchSubmit();


//Calorie Counter//
