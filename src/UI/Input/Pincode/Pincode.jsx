import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { search } from 'india-pincode-search'; // Use the correct function

const PincodeSearch = () => {
  const { register, handleSubmit } = useForm();
  const [district, setDistrict] = useState('');

  const onSubmit = async (data) => {
    
    const { pincode } = data;
    
    try {
      const result = await search(pincode); // Use the `search` function
      
      if (result && result.length > 0) {
        
        setDistrict(result[0].district); // Access the district from the result
      } else {
        setDistrict('District not found');
      }
    } catch (error) {
      console.error('Error fetching district:', error);
      setDistrict('Error fetching district');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center border-b border-gray-300 py-2">
          <input
            {...register('pincode', { required: true })}
            type="text"
            placeholder="Enter PIN code"
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          />
          <button type="submit" className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 text-sm text-white py-1 px-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {district && (
          <div className="mt-4 text-center">
            <p className="text-gray-700">District: {district}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default PincodeSearch;