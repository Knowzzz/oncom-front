export const LoadingUserProfileSkeleton = () => {
  return (
    <div className="animate-pulse bg-zinc-800 border border-zinc-600 w-1/5 flex flex-col p-4">
      <div className="flex justify-center">
        <div className="w-24 h-24 shadow-2xl rounded-full cursor-pointer border-2 border-gray-600"></div>
      </div>
      <div className="mt-4">
        <div className="text-white font-semibold w-1/2 h-4 bg-gray-600 rounded mb-2"></div>
        <div className="bg-zinc-600 text-white w-full h-6 rounded-md mt-2"></div>
      </div>
      <div className="mt-4">
        <div className="text-white font-semibold w-1/2 h-4 bg-gray-600 rounded mb-2"></div>
        <div className="bg-zinc-600 text-white w-full h-6 rounded-md mt-2"></div>
      </div>
      <div className="bg-green-500 text-white w-full h-8 rounded-md mt-4"></div>
      <div className="bg-red-500 text-white w-full h-8 rounded-md mt-4"></div>
      <div className="fixed bottom-4 right-4">
        <div className="flex items-center bg-red-500 text-white px-3 py-2 rounded-full">
          <span className="mr-1 w-4 h-4 bg-gray-600 rounded"></span>
          <span className="w-24 h-4 bg-gray-600 rounded"></span>
        </div>
      </div>
    </div>
  );
};
export const LoadingFriendsSkeleton = () => {
    return Array(5)
      .fill()
      .map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-zinc-800 w-full h-16 flex items-center p-4 mb-2 rounded-md"
        >
          <div className="w-12 h-12 rounded-full bg-gray-600 mr-4"></div>
          <div className="w-3/4 h-4 bg-gray-600 rounded"></div>
        </div>
      ));
  };

