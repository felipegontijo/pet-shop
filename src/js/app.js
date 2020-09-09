// global App object to manage application
App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      let petsRow = $('#petsRow');
      let petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // if modern dapp browser
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // request account access
        await window.ethereum.enable();
      } catch (error) {
        console.error('User denied account access');
      }
    }
    // if legacy dapp browser
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // if no injected web3 instance, fall back to ganache -- insecure for production; development environments ONLY
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function (data) {
      // get contract artifact file (ABI and address) and instantiate it with @truffle/contract
      let AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // set provider for contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // use contract to retrieve and mark adopted pets
      return App.markAdopted();
    })

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    let adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
    
      return adoptionInstance.getAdopters.call(); // using call allows us to read data from the blockchain without sending a transaction
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        // find address stored for pet
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') { // ethereum initializes the addresses array with empty addresses
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true); // disable adopt button and change text to success
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    let petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
