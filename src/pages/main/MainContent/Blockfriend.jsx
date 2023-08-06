import { BsSearch } from "react-icons/bs";


const Blockfriend = () => {
  return (
    <div>
      <div className="relative">
        <input
          type="text"
          name="searchfriend"
          autoComplete="off"
          className="bg-zinc-600 text-white w-full h-10 pl-3 pr-10 rounded-md"
          placeholder="Search"
        />
        <BsSearch className="absolute right-3 top-2 text-white" />
      </div>
      <div className="text-white font-semibold mt-4">
        Blocked - 0
      </div>
    </div>
  );
};

export default Blockfriend;
