
    // Event onClick for find my kitty
    // create search objects for each search option (size, sex, etc)
    // set default selection to 'any' 
    // if no postal/zipcode added or incorrectly formatted, pop up alert to nudge them to add / and show formatting of how to add postal code (A1B-2C3)
    
    // Use .val on drop down element to grab user input of each search option
    // Pull all cats from API that match all search options
    // .append <ul> inside of section 3 with search results
    // ul will include li that includes images, name, age and view more button
    // all detailed information will also pull but be hidden in an object and only display 👇🏽
    // onClick of each li in ul, .append detailed cat information
    // when user clicks on next kitty, previous object with detailed information will hide
    // error handling - loading spinning cat head
    // if nothing returns, have text to show with image of a cat saying no cats found in area.







// API key & URL
const app = {};
app.apiKey='FR5X6Jh3';
app.apiUrl='https://api.rescuegroups.org/http/v2.json';

// function to build search query
function buildQuery(userInput){
    const searchObject = {
        apikey: app.apiKey,
        objectType: 'animals',
        objectAction: 'publicSearch',
        search: {
            resultStart: 0,
            resultLimit: 9,
            resultSort: 'animalID',
            resultOrder: 'asc',
            filters: [
                {
                    fieldName: 'animalSpecies',
                    operation: 'equals',
                    criteria: 'Cat'
                },
                {
                    fieldName: 'animalStatus',
                    operation: 'equals',
                    criteria: 'Available'
                },
                {
                    fieldName: 'animalLocationDistance',
                    operation: 'radius',
                    criteria: `${userInput.distance}`
                },
                {
                    fieldName: 'animalLocation',
                    operation: 'equals',
                    criteria: `${userInput.postalCode}`
                },
                {
                    fieldName: 'animalColor',
                    operation: 'contains',
                    criteria: `${userInput.colour}`
                },
                {
                    fieldName: 'animalCoatLength',
                    operation: 'equals',
                    criteria: `${userInput.fur}`
                },
                {
                    fieldName: 'animalSex',
                    operation: 'equals',
                    criteria: `${userInput.sex}`
                },
                {
                    fieldName: 'animalGeneralAge',
                    operation: 'equals',
                    criteria: `${userInput.age}`
                },
                {
                    fieldName: 'animalBreed',
                    operation: 'contains',
                    criteria: `${userInput.breed}`
                },
                {
                    fieldName: 'animalOKWithKids',
                    operation: 'equals',
                    criteria: `${userInput.kids}`
                }
            ],
            filterProcessing: 1,
            fields: ['animalID', 'animalSpecies', 'animalPictures', 'animalOrgID', 'animalActivityLevel', 'animalAdoptedDate', 'animalAdoptionFee', 'animalAgeString', 'animalAltered', 'animalAvailableDate', 'animalBirthdate', 'animalBirthdateExact', 'animalBreed', 'animalCoatLength', 'animalColor', 'animalColorID', 'animalColorDetails', 'animalCourtesy', 'animalDeclawed', 'animalDescription', 'animalDescriptionPlain', 'animalEnergyLevel', 'animalEyeColor', 'animalGeneralAge', 'animalGeneralSizePotential', 'animalGroomingNeeds', 'animalHousetrained', 'animalIndoorOutdoor', 'animalLocation', 'animalLocationCoordinates', 'animalLocationDistance', 'animalLocationCitystate', 'animalMicrochipped', 'animalMixedBreed', 'animalName', 'animalSpecialneeds', 'animalSpecialneedsDescription', 'animalNewPeople', 'animalNotHousetrainedReason', 'animalObedienceTraining', 'animalOKWithAdults', 'animalOKWithCats', 'animalOKWithDogs', 'animalOKWithKids', 'animalPattern', 'animalPatternID', 'animalPrimaryBreed', 'animalPrimaryBreedID', 'animalRescueID', 'animalSearchString', 'animalSecondaryBreed', 'animalSecondaryBreedID', 'animalSex', 'animalShedding', 'animalSizeCurrent', 'animalSizePotential', 'animalSizeUOM', 'animalSpecies', 'animalSpeciesID', 'animalStatus', 'animalStatusID', 'animalSummary', 'animalThumbnailUrl', 'animalUptodate', 'animalUpdatedDate', 'animalUrl', 'animalVocal', 'animalAffectionate', 'animalApartment', 'animalDrools', 'animalEagerToPlease', 'animalEscapes', 'animalEventempered', 'animalFetches', 'animalGentle', 'animalGoodInCar', 'animalGoofy', 'animalHasAllergies', 'animalHearingImpaired', 'animalHypoallergenic', 'animalIndependent', 'animalIntelligent', 'animalLap', 'animalLeashtrained', 'animalNeedsCompanionAnimal', 'animalNoCold', 'animalOKForSeniors', 'animalOKWithFarmAnimals', 'animalOlderKidsOnly', 'animalOngoingMedical', 'animalPlayful', 'animalPlaysToys', 'animalPredatory', 'animalProtective', 'animalSightImpaired', 'animalSkittish', 'animalSpecialDiet', 'animalSwims', 'animalTimid', 'locationAddress', 'locationCity', 'locationCountry', 'locationUrl', 'locationName', 'locationPhone', 'locationState', 'locationPostalcode', 'animalPictures', 'animalVideos', 'animalVideoUrls']
        }

    }
    return searchObject;
};

// Collect user input
app.collectInfo = function() {
    const postalCode = $('#postalCode').val();
    const age = $('#age').val();
    const breed = $('#breed').val();
    const fur = $('#fur').val();
    const distance = $('#distance').val();
    const size = $('#size').val();
    const sex = $('#sex').val();
    const colour = $('#colour').val();
    return {
        postalCode: postalCode,
        age: age,
        breed: breed,
        fur: fur,
        distance: distance,
        size: size,
        sex: sex,
        colour: colour
    };
}

// RescueGroups API Request
app.getInfo = function(query) {
    $.ajax({
        url: app.apiUrl,
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(query)
    })
    .then( (response) => {
        app.response = response
        // check if responding console.log(response); 
        app.displayInfo(response);
    }).fail((err) => {
        console.log(err);
    })
}

// Display data on the page
app.displayInfo = function(response) {
    // call the search results and add as html
    $('#searchResultsSection').removeClass('hidden');
    $('#searchResults').html('');
    $('#detailedResults').addClass('hidden');


    // cycle through data from api 
    for(let key in response.data){
        const name = response.data[key].animalName;
        // removed because data doesnt provide enough information currently without needing excessive modification. const age = response.data[key].animalAge
        // console.log(response.data[key]);
        let image='';

        if (response.data[key].animalPictures.length === 0) {
            image='assets/placeholderImage.png';
        }
        else {
            image = response.data[key].animalPictures[0].urlSecureFullsize;
        }

        
        const htmlToAdd = `
        <li>
        <div class="imgContainer"><img src="${image}" alt=""></div>
        <h3>${name}</h3>
        <button data-key = ${key}>Click for more information!</button>
        </li>
        `;
        
        // append information to page in #searchResults
        $('#searchResults').append(htmlToAdd);
    }
}

app.showDetails = function(key) {
    // grab object of key so we dont have to type it every time.
    const kitty = app.response.data[key]

    $('#searchResultsSection').addClass('hidden');
    $('#detailedResults').removeClass('hidden');

    // console.log(kitty);
    let image='';

    if (kitty.animalPictures.length === 0) {
        image='assets/placeholderImage.png';
    }
    else {
        image = kitty.animalPictures[0].urlSecureFullsize;
    }

    const name = kitty.animalName;

    let description = kitty.animalDescriptionPlain;
    if (description==='') {
        description = "No description available.";
    }


    const detailedHtml = `
    <div class="imgContainer"><img src="${image}" alt="Image of ${name} from API"></div>
    <div>
        <h3>${name}</h3>
        <ul>
            <li>Info key : Info detail</li>
            <li>Info key : Info detail</li>
            <li>Info key : Info detail</li>
            <li>Info key : Info detail</li>
        </ul>
        <h4>Description</h4>
        <p>${description}</p>
        <a href='#' target="_blank">Link to adoption page</a>
        <a href='#'>Back to search results</a>
    </div>
    `;

    $('.flexParent').html(detailedHtml);
};


// Start app
app.init = function() {
    $('#searchForCats').on('submit', function(e) {
        e.preventDefault();
        const userInput = app.collectInfo();
        // to do : put user input into build query
        const query = buildQuery(userInput);
        // passing query into getInfo
        app.getInfo(query);
    });
    $('#searchResults').on('click', "button", function(e) {
        e.preventDefault();
        const key = $(this).data('key');
        app.showDetails(key);
        // call key to make sure its working console.log(key, app.response.data[key]);
    });
}

// document ready
$(function() {
    app.init();
});