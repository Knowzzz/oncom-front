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

export const LoadingSidebarFriendsSkeleton = () => {
  return (
      <div className="animate-pulse bg-zinc-800 w-64 flex flex-col py-4 border border-zinc-600 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col mb-4 space-y-1">
              <button
                  className="bg-zinc-800 hover:bg-zinc-500 text-white font-semibold rounded-t w-full py-2 focus:outline-none flex items-center px-4">
                  <div className="w-4 h-4 bg-white rounded mr-2" />
                  <div className="w-16 h-4 bg-white rounded" />
              </button>
              <button
                  className="bg-zinc-800 hover:bg-zinc-500 text-gray-300 font-semibold rounded-b w-full py-2 focus:outline-none flex items-center px-4">
                  <div className="w-4 h-4 bg-gray-300 rounded mr-2" />
                  <div className="w-16 h-4 bg-gray-300 rounded" />
              </button>
          </div>
          <div className="flex flex-col space-y-2">
              <p className="text-gray-400 text-sm text-center font-semibold">
                  <div className="w-20 h-4 bg-gray-400 rounded mx-auto" />
              </p>
              <div className="w-full h-16 flex items-center p-4 rounded-md">
                  <div className="w-12 h-12 rounded-full mr-4 bg-white" />
                  <div className="text-white font-semibold">
                      <div className="w-24 h-4 bg-white rounded" />
                  </div>
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

