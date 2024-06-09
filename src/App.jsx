import { useState, useEffect } from "react";
import axios from "axios";

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

  useEffect(() => {
    console.log(books);
  }, [books]);
  return (
    <div className="w-full flex flex-col items-center justify-center pt-20">
      {/* Background Image */}
      <img
        src="/background.svg"
        alt="bkg"
        className=" w-full object-fill fixed filter blur-3xl -z-50 overflow-hidden"
      />
      {/* Nav bar */}
      <div className="navbar absolute top-0 bg-base-100 md:w-2/3 bg-transparent">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">Book Search</a>
        </div>
        <div className="navbar-end">
          <a className="btn bg-[#8800FF]" onClick={handleShowMyBookshelf}>
            My Bookshelf
          </a>
        </div>
      </div>

      {/* Search bar */}
      <div className="p-4 md:w-1/2 flex flex-col items-center justify-center w-full ">
        <label className="input input-bordered flex items-center gap-2 w-full backdrop-blur-3xl bg-black/20">
          <input
            type="text"
            className="grow"
            placeholder="Search a book"
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>

      {/* Loading */}
      {isShowingBookshelf ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl text-slate-50">My Bookshelf</h1>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl text-slate-50">Search</h1>
        </div>
      )}

      {/* Card list */}
      <div className="w-full flex flex-col items-center min-h-screen">
        {isLoading && !book ? (
          <div className="text-6xl text-slate-50 min-h-screen">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : (
          books.map((book) => (
            <div
              key={book?.key}
              className="card lg:card-side shadow-xl mx-4 md:w-1/2 backdrop-blur-3xl m-2 bg-black/20"
            >
              <figure className="">
                <img
                  src={`https://covers.openlibrary.org/b/id/${book?.cover_i}-L.jpg`}
                  alt="Album"
                  className="w-44 md:w-68 m-7"
                />
              </figure>
              <div className="card-body p-7 md:pl-0 md:w-2/3 gap-5">
                <div>
                  <h2
                    className="card-title text-2xl cursor-pointer"
                    onClick={() =>
                      window.open(`https://openlibrary.org${book?.key}`)
                    }
                  >
                    {book?.title}
                  </h2>
                  <p>by {book?.author_name.join(", ")}</p>
                </div>
                <p>
                  <strong>Published:</strong> {book?.first_publish_year} -{" "}
                  {book?.publisher[0]}
                </p>
                <p>
                  <strong>Pages:</strong> {book?.number_of_pages_median}
                </p>
                <p>
                  <strong>Number of Editions:</strong> {book?.edition_count}
                </p>
                <p className="line-clamp-1">
                  <strong>Languages: {`(${book?.language.length})`}</strong> -{" "}
                  {book?.language.join(", ")}
                </p>
                <div className="card-actions items-center flex-col md:flex-row justify-center md:justify-end">
                  <div>
                    <span className="font-bold text-lg">{book?.ratings_average.toFixed(2)}{" "}</span><span className="text-xl">⭐</span>
                  </div>
                  <button
                    className="btn btn-primary bg-[#8800FF] text-slate-300 border-none"
                    onClick={() => addRemoveBookshelf(book)}
                  >
                    {isShowingBookshelf
                      ? "Remove from bookshelf"
                      : "Add to bookshelf"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded mt-10 bottom-0">
        <nav className="grid grid-flow-col gap-4">
          <a className="link link-hover" href="https://vaibhavpf.netlify.app">
            About me
          </a>
        </nav>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a href="https://x.com/vaibhavraj_exe">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a href="https://www.youtube.com/@Vaibhav-sr8tk">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a href="https://www.instagram.com/vaibhavraj.exe">
              <img src="/insta.svg" alt="" srcSet="" className="w-6" />
            </a>
          </div>
        </nav>
        <aside>
          <p>Made by Vaibhav Raj for Marquee Equity</p>
        </aside>
      </footer>
    </div>
  );
}

export default App;
