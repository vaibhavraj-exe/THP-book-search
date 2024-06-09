export default function LoadingSection({isShowingBookshelf}) {
    return (
        <>
        {isShowingBookshelf ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl text-slate-50">My Bookshelf</h1>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl text-slate-50">Search</h1>
        </div>
      )}
        </>
    )
}