const appID = '5ff9d9d1';
const appKey = '8a580ee40ddee9e24cc9c02664aced07';

const state = {
  searchItems: [],
  storedItems: []
}


function getFoodFromApi(query){
  $.getJSON(`https://api.nutritionix.com/v1_1/search/${query}?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat&appId=5ff9d9d1&appKey=8a580ee40ddee9e24cc9c02664aced07`, (d)=>{
    state.searchItems = d.hits;
    displayResults();
  });

};

const addItem = function(state, item, cal) {
  let itemObj = {item, cal};
  state.storedItems.push(itemObj);
  // console.log(item);
  // console.log(state.searchItems);
  console.log(state.storedItems);

  // let itemObj;
  // state.searchItems.map(function(sItem) {
  //   let searchItemName = `${sItem.fields.brand_name} ${sItem.fields.item_name}`;
  //   if(searchItemName === item){
  //     itemObj = sItem;
  //   }
  //   console.log(itemObj);
  // });
  // state.storedItems.push(itemObj);
}


const removeItem = function(item) {
  state.storedItems.splice(state.storedItems.indexOf(item), 1);
}

const displayTodaysMenu = function() {
  $('.js-todays-meals').html("");
  state.storedItems.map(function(item) {
  $('.js-todays-meals').append(
    `<div class= "mealBar">
     <p class="mealName">${item.item}${item.cal}</p>
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

$('.flexcontainer').on('click','.select', function(){
  addItem(state, 
  $(this).closest('div').find('.title').text(),
  $(this).closest('div').find('.calories').text());
  displayTodaysMenu();
});

$('div').on('click', 'button.delete', function(event){
  removeItem($(this).closest('div').find('.mealName').text());
  displayTodaysMenu();
});

watchSubmit();
