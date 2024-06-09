import { useState, useEffect } from "react";
import axios from "axios";

import SearchBar from "./components/SearchBar";
import LoadingSection from "./components/LoadingSection";
import CardList from "./components/CardList";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingBookshelf, setIsShowingBookshelf] = useState(false);

  const [query, setQuery] = useState("");

  const book = books ? books[0] : null;

  const fetchData = (query) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    axios
      .get(`https://openlibrary.org/search.json?q=${query}&limit=10&page=1`, {
        cancelToken: source.token,
      })
      .then((response) => {
        setBooks(response.data.docs);
        setIsLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error(error);
        }
      });

    return () => {
      source.cancel("Request canceled by cleanup");
    };
  };

  // adding or removing books from bookshelf
  const addRemoveBookshelf = (book) => {
    const bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];
    if (!isShowingBookshelf) {
      try {
        bookshelf.push(book);
        localStorage.setItem("bookshelf", JSON.stringify(bookshelf));
      } catch (error) {
        console.error("Error adding to bookshelf: ", error);
      }
    } else {
      setBooks(books.filter((b) => b.key !== book.key));
      localStorage.setItem(
        "bookshelf",
        JSON.stringify(books.filter((b) => b.key !== book.key))
      );
    }
  };

  // show or remove bookshelf
  const handleShowMyBookshelf = () => {
    console.log("Showing bookshelf: ", isShowingBookshelf);
    if (isShowingBookshelf) {
      setIsShowingBookshelf(!isShowingBookshelf);
      setBooks([]);
      return;
    }
    setIsShowingBookshelf(!isShowingBookshelf);
    try {
      const bookshelf = JSON.parse(localStorage.getItem("bookshelf")) || [];
      console.log("Bookshelf: ", bookshelf);
      setBooks(bookshelf);
    } catch (error) {
      console.error("Error showing bookshelf: ", error);
      setBooks([]);
    }
  };

  useEffect(() => {
    setIsShowingBookshelf(false);
    setIsLoading(true);
    console.log("fetching : ", query);
    fetchData(query);
  }, [query]);

  // useEffect(() => {
  //   console.log(books);
  // }, [books]);

  return (
    <div className="w-full flex flex-col items-center justify-center pt-20">
      {/* Background Image */}
      <img
        src="/background.svg"
        alt="bkg"
        className=" w-full object-fill fixed filter blur-3xl -z-50 overflow-hidden"
      />
      {/* Nav bar */}
      <NavBar handleShowMyBookshelf={handleShowMyBookshelf} />

      {/* Search bar */}
      <SearchBar setQuery={setQuery} />

      {/* Loading */}
      <LoadingSection isShowingBookshelf={isShowingBookshelf} />

      {/* Card list */}
      <CardList
        isLoading={isLoading}
        book={book}
        books={books}
        addRemoveBookshelf={addRemoveBookshelf}
        isShowingBookshelf={isShowingBookshelf}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
