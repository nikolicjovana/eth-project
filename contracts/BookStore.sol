pragma solidity ^0.5.0;

contract BookStore {
	uint public bookCount = 0;

	struct Book{
		uint id;
		string name;
		string author;
		string genre;
		uint price;
	}

	mapping(uint => Book) public books;

	event BookAdded(
		uint id,
		string name,
		string author,
		string genre,
		uint price
	);

	event BookUpdated(
		uint id,
		string name,
		string author,
		string genre,
		uint price
	);

	event BookDeleted(
		uint id
	);

	constructor() public {
		addBook("Na Drini Cuprija", "Ivo Andric", "roman", 1000);
	}

	function addBook(string memory _name, string memory _author, string memory _genre, uint _price) public{
		bookCount++;
		books[bookCount] = Book(bookCount, _name, _author, _genre, _price);
		emit BookAdded(bookCount, _name, _author, _genre, _price);
	}

	function deleteBook(uint _id) public {
		delete(books[_id]);
		bookCount--;
		emit BookDeleted(_id);
	}

	function updateBook(uint _id, string memory _name, string memory _author, string memory _genre, uint _price) public {
		books[_id].name =  _name;
		books[_id].author = _author;
		books[_id].genre = _genre;
		books[_id].price = _price;
		emit BookUpdated(_id, _name, _author, _genre, _price);
	}
	
}