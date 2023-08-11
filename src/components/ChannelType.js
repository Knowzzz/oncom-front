import { FiHash, FiSpeaker, FiThumbsUp } from "react-icons/fi";


export const ChannelType = ({ handleChannelTypeChange, channelType }) => {

    return (
        <div className="mb-4">
        <div className="grid gap-4">
          {["TEXT", "VOCAL", "VOTE"].map((type) => (
            <label
              key={type}
              className={`flex p-2 border border-gray-600 rounded ${
                channelType === type ? "border-white" : "hover:border-zinc-400"
              } cursor-pointer`}
            >
              {type === "TEXT" ? <FiHash size={24} /> : type === "VOCAL" ? <FiSpeaker size={24} /> : <FiThumbsUp size={24} />}
              <div className="ml-4">
                <div>{type}</div>
                <small>
                  {type === "TEXT"
                    ? "Chat textuel pour échanger des messages."
                    : type === "VOCAL"
                    ? "Salon vocal pour discuter à haute voix."
                    : "Salon pour créer et gérer les votes."}
                </small>
              </div>

              <input
                type="radio"
                name="channelType"
                value={type}
                checked={channelType === type}
                onChange={handleChannelTypeChange}
                className="custom-radio form-radio ml-auto"
              />
            </label>
          ))}
        </div>
      </div>
    )
}

export const customRadioStyle = `
.custom-radio::-webkit-radio {
  width: 20px;
  height: 20px;
}

.custom-radio::-moz-radio {
  width: 20px;
  height: 20px;
}

.custom-radio::before {
  width: 20px;
  height: 20px;
}
`;