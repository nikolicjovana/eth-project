App = {
	loading: false,
	contracts: {},
	load: async () => {
		await App.loadWeb3()
		await App.loadAccount()
		await App.loadContract()
		await App.render()
	},

	loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Konektuj se na MetaMask.")
    }
    
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        await ethereum.enable()
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
     }
    }
    
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      web3.eth.sendTransaction({/* ... */})
    }
 
    else {
      console.log('Pretraživač ne podržava eterijum. Instalirati MetaMask.')
    }
  },

  loadAccount: async() => {
  	web3.eth.defaultAccount = web3.eth.accounts[0];
  	App.account = web3.eth.accounts[0]
  },

  loadContract: async() => {
  	const bookStore = await $.getJSON('BookStore.json')
  	App.contracts.BookStore = TruffleContract(bookStore)
  	App.contracts.BookStore.setProvider(App.web3Provider)

  	App.bookStore = await App.contracts.BookStore.deployed()
  },

  render: async() => {
  	if(App.loading){
  		return;
  	}

  	App.setLoading(true)

  	$('#account').html(App.account)

  	await App.renderBooks()

  	App.setLoading(false)
  },

  addBook: async () => {
  	App.setLoading(true)
  	const bookName = $('#name').val()
	const bookAuthor = $('#author').val()
	const bookGenre = $('#genre').val()
	const bookPrice = $('#price').val()
  	if($('.submit').attr('value') == null){
	  	await App.bookStore.addBook(bookName, bookAuthor, bookGenre, bookPrice)
  	}
  	else{
  		const bookId = parseInt($('.submit').attr('value'))
  		await App.bookStore.updateBook(bookId, bookName, bookAuthor, bookGenre, bookPrice)
  	}
  	window.location.reload()
  },

  renderBooks: async() => {
  	const bookCount = await App.bookStore.bookCount()
  	
  	const $bookTemplate = $('.bookTemplate')

  	for (var i = 1; i <= bookCount; i++){
  		const book = await App.bookStore.books(i)
  		const bookId = book[0].toNumber()
  		const bookName = book[1]
  		const bookAuthor = book[2]
  		const bookGenre = book[3]
  		const bookPrice = book[4].toNumber()

  		
	    const $newBookTemplate = $bookTemplate.clone()
	    console.log($newBookTemplate)
	    $newBookTemplate.find('.name').html(bookName)
	    $newBookTemplate.find('.author').html(bookAuthor)
	    $newBookTemplate.find('.genre').html(bookGenre)
	    $newBookTemplate.find('.price').html(bookPrice)
	    $newBookTemplate.find('.delete').prop('name', bookId).on('click', App.deleteBook)
	    $newBookTemplate.find('.update').prop('name', bookId).on('click', App.updateBook)


	    $('#books').append($newBookTemplate)

	    $newBookTemplate.show()

  	}

  	$bookTemplate.remove()
  },

   setLoading: (boolean) => {
   	App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },

  deleteBook: async (e) => {
  	App.setLoading(true)
  	const bookId = e.target.name
  	await App.bookStore.deleteBook(bookId)
  	window.location.reload()
  },

  updateBook: async (e) => {
  	const bookId = e.target.name
  	const book = await App.bookStore.books(bookId)
  	const bookName = book[1]
  	const bookAuthor = book[2]
  	const bookGenre = book[3]
  	const bookPrice = book[4].toNumber()
  	console.log(bookName)
  	$('#name').val(bookName)
  	$('#author').val(bookAuthor)
  	$('#genre').val(bookGenre)
  	$('#price').val(bookPrice)
  	$('.submit').prop('value', bookId)
  	$('.submit').html('Izmeni')
  }
}

$(() => {
	$(window).load(() => {
		App.load()
	})
})