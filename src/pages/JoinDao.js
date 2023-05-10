import { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

const baseURL = 'http://localhost:8080';

function JoinDaoPage() {
  const [daoInfo, setDaoInfo] = useState(null);
  const { inviteToken } = useParams();
  const navigate = useNavigate();
  
  const userId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    if (!inviteToken) { return }
    async function fetchDaoInfo() {
      try {
        const response = await axios.get(`${baseURL}/invite/${inviteToken}`);
        if (response.status === 200) {
          const daoId = response.data.daoId;

          const daoResponse = await axios.get(`${baseURL}/api/dao/getOne`, {
            params: { daoId, userId },
            headers: {
              'x-access-token': localStorage.getItem("accessToken"),
            },
          });

          setDaoInfo(daoResponse.data);
        } else {
          toast.error("Error while fetching DAO data")
        }
      } catch (error) {
        console.error('Error fetching DAO info:', error);
      }
    }
    fetchDaoInfo();
  }, [inviteToken]);

  const handleJoin = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(`${baseURL}/api/invite/accept`, { userId, inviteToken, daoId: daoInfo.dao.id }, {
        headers: { 'x-access-token': accessToken }
      });
      if (response.status === 200) {
        toast.success("You have successfully joined the DAO!");
        navigate(`/dao/${daoInfo.dao.id}`)
      }
    } catch (error) {
      console.error('Error joining DAO:', error);
    }
  };

  if (!daoInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="p-8 bg-white rounded-xl shadow-md">
        <img className="w-32 h-32 mx-auto mb-4 rounded-full" src={daoInfo.dao.logoUrl} alt={`${daoInfo.dao.name} logo`} />
        <h1 className="text-3xl font-bold mb-4">{daoInfo.dao.name}</h1>
        <p className="text-xl mb-6">You have been invited to join this DAO.</p>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={handleJoin}
        >
          Join
        </button>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
}

export default JoinDaoPage;
