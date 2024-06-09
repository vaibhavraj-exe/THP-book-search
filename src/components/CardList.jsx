export default function CardList({isLoading, book, books, addRemoveBookshelf, isShowingBookshelf}) {
    return (
        <div className="w-full flex flex-col items-center min-h-screen">
        {isLoading && !book ? (
          <div className="text-6xl text-slate-50 min-h-screen">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : (
          books?.map((book) => (
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
                  <p>by {book?.author_name?.join(", ")}</p>
                </div>
                <p>
                  <strong>Published:</strong> {book?.first_publish_year} -{" "}
                  {book?.publisher ? book?.publisher[0] : null}
                </p>
                <p>
                  <strong>Pages:</strong> {book?.number_of_pages_median}
                </p>
                <p>
                  <strong>Number of Editions:</strong> {book?.edition_count}
                </p>
                <p className="line-clamp-1">
                  <strong>Languages: {`(${book?.language?.length})`}</strong> -{" "}
                  {book?.language?.join(", ")}
                </p>
                <div className="card-actions items-center flex-col md:flex-row justify-center md:justify-end">
                  <div>
                    <span className="font-bold text-lg">{book?.ratings_average?.toFixed(2)}{" "}</span><span className="text-xl">⭐</span>
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
    )
}