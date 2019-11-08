   /*****************************
Treehouse Techdegree
FSJS project 5 - Public API Request
Andy Tuinstra
*********************************/


//Global Variables
const gallery = document.querySelector('#gallery');
const searchContainer = document.querySelector('.search-container');
const body = document.querySelector('body');
let results = [];

//calls the fetchUsers function to retrieve the user API
fetchUsers('https://randomuser.me/api/?inc=picture,name,location,phone,dob,email,state&results=12&nat=us')
    .then(()=>searchFilter())
    .catch( error => console.log('Oops, something went wrong...', error));

//reusable fetch function
//fetchUsers is fed a url (in this case, https://randomuser.me/api/) which is modified for our specific needs.
//the data ensures that we only recieve 12 employees along with the required information.
async function fetchUsers(url) {
    const users = await fetch(url);
    const usersJSON = await users.json();
    usersJSON.results.forEach(user => {
        displayGallery(user);
        results.push(user);
    });
};

/*****************************
Gallery container
******************************/

//function that displays the randomly generated users.
function displayGallery(user){
    //creates the div card containers and appends it to the gallery div
    const divCard = document.createElement('div');
    gallery.appendChild(divCard);
    divCard.className ='card';
    
    //inserts the html for each user card and displays the proper information pulled from the fetch request
    divCard.innerHTML = `
    <div class="card-img-container">
        <img class="card-img" src="${user.picture.medium}" alt="profile picture">
    </div>
    <div class="card-info-container">
        <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
        <p class="card-text">${user.email}</p>
        <p class="card-text cap">${user.location.city}</p>
    </div>  
    `;

    //calls the function that creates the modal window when a user is clicked on
    divCard.addEventListener('click', function(){
        createModal(user);
    });
};

/*****************************
Search container
******************************/

//Making a variable for the search html and then attaching it to the searchContainer div
const searchHTML = `<form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;
searchContainer.innerHTML = searchHTML;

//function to filter out user cards when characters typed match/don't match
function searchFilter(){
    let input = document.querySelector('#search-input');
    const userCards = gallery.children;
    const search = document.querySelector('#search-submit')

    function filteredUsers(){
       let inputTxt = input.value;

       for(let user of userCards){
           const username = user.querySelector('#name').textContent;
           if (inputTxt != ''){
               if (username.toLowerCase().includes(inputTxt.toLowerCase())){
                   user.style.display = '';
               } else{
                   user.style.display = 'none';
               };
           };
       };
    };

    input.addEventListener('input',()=>{
        filteredUsers();
    });
    search.addEventListener('click', (e)=>{
        e.preventDefault();
        filteredUsers();
    });
};

/*****************************
MODAL WINDOWS
******************************/

//function that creates the modal window for each user.
function createModal(user){
    //creates the container div, assigns the class name and appends it to the body.
    const container = document.createElement('div');
    container.className = 'modal-container';
    body.appendChild(container);

    //creating the birthday and properly formatting it to display month, day and year
    let dob = user.dob.date;
    let dateTime = dob.slice(0,10);
    let dobFormat = dateTime.replace(/^(\d{4})-(\d{2})-(\d{2})/, "$2/$3,$1");
    
    //inserts the html for each card and displays proper information from the fetch request
    container.innerHTML =`
        <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
            <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
            <img class="modal-img" src="${user.picture.large}" alt="${user.name.first} ${user.name.last}'s Profile Picture">
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">${user.phone}</p>
                <p class="modal-text">${user.location.street.number} ${user.location.street.name} ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${dobFormat}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>`;
    
    //selecting the button id's and creating a variable to check the modal index
    const next = document.querySelector('#modal-next');
    const back = document.querySelector('#modal-prev');
    const xbtn = document.querySelector('#modal-close-btn');
    var index = results.indexOf(user);

    /**functions to make button actually work.
    the 'x' button closes the modal window
    the next button flips to the next user modal, back button does the same in reverse (obviously) 
    **/
    $(xbtn).click(function(){
        $(container).remove();
    });

    $(next).click(function(){
        $(container).remove();
        createModal(results[index+1]);
    });

    $(back).click(function(){
        $(container).remove();
        createModal(results[index-1]);
    });

    //calls indexCheck function
    indexCheck(index);

};

//helping function that checks modal index and hides appropriate buttons for error prevention
function indexCheck(index){
    if(index <= 0){
        $('button#modal-prev').hide();
    } else if(index >= 11){
        $('button#modal-next').hide();
    }
};