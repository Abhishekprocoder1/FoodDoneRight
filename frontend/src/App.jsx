import React, { useState } from 'react';
import axios from 'axios';

function AddressForm() {
  const [address, setAddress] = useState('');
  const [outlet, setOutlet] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/find-outlet?address=${encodeURIComponent(address)}`);
      setOutlet(response.data.outlet || 'Not found');
    } catch (error) {
      setOutlet('Error fetching outlet.');
    }
  };

  return (
    <div>
      <h2>Find Your Outlet</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
        />
        <button type="submit">Submit</button>
      </form>
      {outlet && <p>Outlet: {outlet}</p>}
    </div>
  );
}

export default AddressForm;
