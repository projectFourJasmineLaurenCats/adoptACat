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
            resultSort: 'animalLocationDistance',
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
            // incredibly long list of fields
            fields: ['animalID', 'animalSpecies', 'animalPictures', 'animalOrgID', 'animalActivityLevel', 'animalAdoptedDate', 'animalAdoptionFee', 'animalAgeString', 'animalAltered', 'animalAvailableDate', 'animalBirthdate', 'animalBirthdateExact', 'animalBreed', 'animalCoatLength', 'animalColor', 'animalColorID', 'animalColorDetails', 'animalCourtesy', 'animalDeclawed', 'animalDescription', 'animalDescriptionPlain', 'animalEnergyLevel', 'animalEyeColor', 'animalGeneralAge', 'animalGeneralSizePotential', 'animalGroomingNeeds', 'animalHousetrained', 'animalIndoorOutdoor', 'animalLocation', 'animalLocationCoordinates', 'animalLocationDistance', 'animalLocationCitystate', 'animalMicrochipped', 'animalMixedBreed', 'animalName', 'animalSpecialneeds', 'animalSpecialneedsDescription', 'animalNewPeople', 'animalNotHousetrainedReason', 'animalObedienceTraining', 'animalOKWithAdults', 'animalOKWithCats', 'animalOKWithDogs', 'animalOKWithKids', 'animalPattern', 'animalPatternID', 'animalPrimaryBreed', 'animalPrimaryBreedID', 'animalRescueID', 'animalSearchString', 'animalSecondaryBreed', 'animalSecondaryBreedID', 'animalSex', 'animalShedding', 'animalSizeCurrent', 'animalSizePotential', 'animalSizeUOM', 'animalSpecies', 'animalSpeciesID', 'animalStatus', 'animalStatusID', 'animalSummary', 'animalThumbnailUrl', 'animalUptodate', 'animalUpdatedDate', 'animalUrl', 'animalVocal', 'animalAffectionate', 'animalApartment', 'animalDrools', 'animalEagerToPlease', 'animalEscapes', 'animalEventempered', 'animalFetches', 'animalGentle', 'animalGoodInCar', 'animalGoofy', 'animalHasAllergies', 'animalHearingImpaired', 'animalHypoallergenic', 'animalIndependent', 'animalIntelligent', 'animalLap', 'animalLeashtrained', 'animalNeedsCompanionAnimal', 'animalNoCold', 'animalOKForSeniors', 'animalOKWithFarmAnimals', 'animalOlderKidsOnly', 'animalOngoingMedical', 'animalPlayful', 'animalPlaysToys', 'animalPredatory', 'animalProtective', 'animalSightImpaired', 'animalSkittish', 'animalSpecialDiet', 'animalSwims', 'animalTimid', 'locationAddress', 'locationCity', 'locationCountry', 'locationUrl', 'locationName', 'locationPhone', 'locationState', 'locationPostalcode', 'animalPictures', 'animalVideos', 'animalVideoUrls']
        }

    }
    // Add user inputs to query object
    for(let key in userInput){
        if(userInput[key] !== '' && userInput[key] !== 'any'){
            const filterItem = {
                fieldName: key,
                operation: 'equals',
                criteria: userInput[key]
            }
            if(key === 'animalLocationDistance') {
                filterItem.operation = 'radius';
            }
            if(key === 'animalColor' || key === 'animalBreed') {
                filterItem.operation = 'contains';
            } 
            searchObject.search.filters.push(filterItem);
        }
    }
    return searchObject;
};

// Collect user input
app.collectInfo = function() {
    let postalCode = $('#postalCode').val();

    //postal code missing space correction i.e. A1A1A1 --> A1A 1A1
    if(/^[a-z][0-9][a-z][0-9][a-z][0-9]$/i.test(postalCode)){
        postalCode = postalCode.slice(0, 3) + ' ' + postalCode.slice(3);
    }
    //tests if it is a postal or a zip, ! tests if it is neither of these 
    else if(!(/^[a-z][0-9][a-z] [0-9][a-z][0-9]$/i.test(postalCode) || /^[0-9]{5}$/.test(postalCode))) {
        alert('Please enter valid postal or zip code');
    }
    //it is what it is, would like to add styling to this in the future


    const age = $('#age').val();
    const breed = $('#breed').val();
    const fur = $('#fur').val();
    const distance = $('#distance').val();
    const kids = $('#kids').val();
    const sex = $('#sex').val();
    const colour = $('#colour').val();
    return {
        animalLocation: postalCode.toUpperCase(),
        animalGeneralAge: age,
        animalBreed: breed,
        animalCoatLength: fur,
        animalLocationDistance: distance,
        animalOKWithKids: kids,
        animalSex: sex,
        animalColor: colour
    };
}

// RescueGroups API Request
app.getInfo = function(query) {
    // API works by POSTing a json query, and then working with the response
    $.ajax({
        url: app.apiUrl,
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(query)
    })
    .then( (response) => {
        app.response = response
        app.displayInfo(response);
    }).fail((err) => {
        $('#searchResults').html (`
            <li class="errorMessage">
            <p> Error - No kitties found 😿</p>
            </li>
        `)
    })
}

// Display data on the page
app.displayInfo = function(response) {
    // call the search results and add as html
    $('#searchResultsSection').removeClass('hidden');
    $('#searchResults').html('');
    $('#detailedResults').addClass('hidden');

    if(response.status === 'error' || !('data' in response) || Object.keys(response.data).length === 0 ){
        $('#searchResults').html (`
            <li class="errorMessage">
            <p> Error - No kitties found 😿</p>
            </li>
        `)
    }


    // cycle through data from api 
    for(let key in response.data){
        const name = response.data[key].animalName;
        let image='';

        if (response.data[key].animalPictures.length === 0) {
            image='assets/placeholderImage.png';
        }
        else {
            image = response.data[key].animalPictures[0].urlSecureFullsize;
        }

        // alt tag left empty intentionally as SR will pull the name from the h3 below and we can't predict what the photo looks like
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

// Display full details of selected kitty
app.showDetails = function(key) {
    // grab object of key so we dont have to type it every time.
    const kitty = app.response.data[key]

    $('#searchResultsSection').addClass('hidden');
    $('#detailedResults').removeClass('hidden');

    let image='';

    if (kitty.animalPictures.length === 0) {
        image='assets/placeholderImage.png';
    }
    else {
        image = kitty.animalPictures[0].urlSecureFullsize;
    }

    const name = kitty.animalName;

    let description = kitty.animalDescriptionPlain;
    if (description === '') {
        description = "No description available.";
    }

    // These are the keys we want to list, if they exist in "kitty"
    const keysOfInterest = ['animalActivityLevel', 'animalBirthdate', 'animalBreed', 'animalCoatLength', 'animalColor', 'animalEnergyLevel', 'animalEyeColor', 'animalIndoorOutdoor', 'animalMicrochipped', 'animalSpecialneeds', 'animalOKWithCats', 'animalOKWithDogs', 'animalOKWithKids', 'animalSex', 'animalVocal', 'animalHasAllergies', 'animalHearingImpaired', 'animalHypoallergenic', 'animalOKForSeniors', 'animalOKWithFarmAnimals', 'animalOlderKidsOnly', 'animalPlayful', 'animalSkittish', 'animalSpecialDiet'];
    
    // Append each one
    let infoTags = '';
    keysOfInterest.forEach((key) => {
        if(key in kitty && kitty[key] !== ''){
            // Add spaces before each capital letter, and removed "animal" from the beginning
            infoTags += `
            <li>
            ${key.replace(/([A-Z])/g,' $1').slice(7)} : ${kitty[key]}
            </li>
            `
        }

    });
    // alt tags left empty intentionally as SR will pull the name from the h3 below
    const detailedHtml = `
    <div class="imgContainer"><img src="${image}" alt=" "></div>
    <div class="infoContainer">
        <h3>${name}</h3>
        <ul>
            ${infoTags}

        </ul>
        <h4>Description</h4>
        <p>${description}</p>
        <div class="orgInfo"></div>
        <a class="return" href='#'>Back to search results</a>
    </div>
    `;

    $('.flexParent').html(detailedHtml);

    app.orgInfo(kitty.animalOrgID);
};

// Attempt to get adoption organization information
app.orgInfo = function(orgID) {
    let orgInfo = `
    {
        "apikey": "${app.apiKey}",
        "objectType":"orgs",
        "objectAction":"publicView",
        "values":
        [
            {
                "orgID":"${orgID}"
            }
        ],
        "fields":["orgID","orgName","orgAddress","orgPhone","orgEmail","orgWebsiteUrl","orgAdoptionUrl"]
    }
    `;
    $.ajax({
        url: app.apiUrl,
        method: 'POST',
        dataType: 'json',
        data: orgInfo
    })

    .then( (response) => {
        if(response.data.length > 0 ) { 
            const orgObject = response.data[0];
            let orgHtml = `
                <h4>Adoption Organization Information</h4>
                <p>You can adopt this very good cat at ${orgObject.orgName}</p>
            `;
            if(orgObject.orgAdoptionUrl !== ''){
                orgHtml += `
                <p>This kitty's website is <a target="_blank" href="${orgObject.orgAdoptionUrl}">${orgObject.orgAdoptionUrl}</a></p>
                `
            }
            if (orgObject.orgWebsiteUrl !== '') {
                orgHtml += `
                <p>This organization's website is <a target="_blank" href="${orgObject.orgWebsiteUrl}">${orgObject.orgWebsiteUrl}</a></p>
                `
            }
            if (orgObject.orgPhone !== '') {
                orgHtml += `
                <p>You can call this organization to adopt this kitty at ${orgObject.orgPhone} </p>
                `
            }
            $('.detailedResults .orgInfo').html(orgHtml);
        }
        else {
            $('.detailedResults .orgInfo').html(`
                <p>Error - No organization information found.</p>
            `);
        }

    }).fail((err) => {
        $('.detailedResults .orgInfo').html(`
            <p>Error - No organization information found.</p>
        `);
    })
}

// Start app
app.init = function() {
    // Listener for search form
    $('#searchForCats').on('submit', function(e) {
        e.preventDefault();
        const userInput = app.collectInfo();
        const query = buildQuery(userInput);
        // passing query into getInfo
        app.getInfo(query);
    });
    // Listener for getting kitty details
    $('#searchResults').on('click', 'button', function(e) {
        e.preventDefault();
        const key = $(this).data('key');
        app.showDetails(key);
        $(document).scrollTop($('#detailedResults').offset().top);
    });
    // Listener to return to search results
    $('#detailedResults').on('click','.return', function(e) {
        e.preventDefault();
        $('#searchResultsSection').removeClass('hidden');
        $('#detailedResults').addClass('hidden');
        $(document).scrollTop($('#searchResultsSection').offset().top);
    });
}

// document ready
$(function() {
    app.init();
});