import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:8080';

const SidebarChannel = ({ daoId }) => {
  const [daoData, setDaoData] = useState(null);

  useEffect(() => {
    if (!daoId) { return }

    async function fetchDao() {
      try {
        const accessToken = localStorage.getItem('accessToken');

        const result = await axios.get(`${baseURL}/api/dao/getOne`, {
          params: {
            daoId: daoId,
            userId: JSON.parse(localStorage.getItem('user')).id,
          },
          headers: {
            'x-access-token': accessToken,
          },
        });
        console.log(result.data);

        setDaoData(result.data.dao);
      } catch (error) {
        console.error('Error fetching DAO data:', error);
      }
    }

    fetchDao();
  }, [daoId]);

  if (!daoData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-800 text-white h-screen w-64">
      <div className="flex items-center justify-between py-3 px-4">
        <h1 className="text-xl font-semibold">{daoData.name}</h1>
        <button className="text-gray-400 hover:text-white">
          <i className="fas fa-cog"></i>
        </button>
      </div>

      <div className="px-4">
        {daoData.channels.map((channel) =>
          !channel.categorieId ? (
            <Link
              key={channel.id}
              to={`/dao/${daoId}/channel/${channel.id}`}
              className="block cursor-pointer py-2 hover:bg-gray-700"
            >
              # {channel.name}
            </Link>
          ) : null
        )}
      </div>

      {daoData.categories.map((category) => (
        <div key={category.id} className="px-4">
          <div className="text-gray-400 py-2 hover:text-white">
            {category.name}
          </div>
          {category.channels.map((channel) => (
            <Link
              key={channel.id}
              to={`/dao/${daoId}/categorie/${category.id}/channel/${channel.id}`}
              className="block cursor-pointer py-2 pl-4 hover:bg-gray-700"
            >
              # {channel.name}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SidebarChannel;
