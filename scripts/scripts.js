
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
function buildQuery(){
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
        // check if responding console.log(response); 
        api.displayInfo(response);
    })
}

// Display data on the page
app.displayInfo = function(response) {
    // call the search results and add as html
    $('#searchResults').html('')

    // cycle through data from api 
    for(let key in response.data){
        const name = response.data[key].animalName;
        // removed because data doesnt provide enough information currently without needing excessive modification. const age = response.data[key].animalAge
        const image = response.data[key].animalPictures[0].urlSecureFullsize;

        // append information to page in #searchResults
        $('#searchResults').append

        const htmlToAdd = `
        <li>
            <div class="imgContainer"><img src="${image}" alt=""></div>
            <h3>${name}</h3>
            <button>Click for more information!</button>
        </li>
        `;

    }
}

// Start app
app.init = function() {
    $('#searchForCats').on('submit', function(e) {
        e.preventDefault();

        const userInput = app.collectInfo();

        // to do : put user input into build query
        const query = buildQuery();
        // passing query into getInfo
        app.getInfo(query);
    });
}

// document ready
$(function() {
    app.init();
});