export default function NavBar({handleShowMyBookshelf}){
    return (
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
    )
}