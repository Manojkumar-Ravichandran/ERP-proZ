import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';
import AlertNotification from '../../UI/AlertNotification/AlertNotification';
import Breadcrumps from '../../UI/Breadcrumps/Breadcrumps';
import Button from '../../UI/Buttons/Button/Button';
import { whatsappQrScanEffect, whatsappQrstatusEffect } from '../../redux/Whatsapp/WhatsappEffect';
import { useNavigate } from 'react-router';

const Whatsapp = () => {
      const navigate = useNavigate();
  
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [toastData, setToastData] = useState({ show: false });
  const [islogin, SetIsLogin] = useState(true);

  const breadcrumbItems = [
    { id: 1, label: "Home", link: "/user" },
    { id: 2, label: "Whatsapp", link: "" },
  ];

  const intervalRef = useRef(null); // Store the interval ID

  const fetchStatusData = useCallback(async () => {
    const controller = new AbortController(); // Create an AbortController instance
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await axios.get('https://erpwa.proz.in/session/status', {
        signal: controller.signal,
      });

      clearTimeout(timeout); 

      console.log('Status Response:', response);

      if (response?.data?.status === 'success') {
        console.log('Status is success, stopping interval.');

        // Stop the interval
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        // Call another API
        await fetchAnotherAPI();
      } else {
        console.log('Status is not success, continuing interval.');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request timed out, silently canceling.');
      } else {
        console.error('Error fetching status:', err);
      }
    }
  }, []);

  const fetchAnotherAPI = async () => {
    try {
      const response = await whatsappQrScanEffect();
      console.log('Another API Response:', response);

      setToastData({
        show: true,
        type: 'success',
        message: ' login suceess successfully!',

      });
      navigate('/user');

    } catch (err) {
      console.error('Error calling another API:', err);
      setError('Failed to call another API.');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('https://erpwa.proz.in/get-qr', {
        responseType: 'blob',
      });
      console.log('QR Code Response:', response);

      setQrCodeUrl(response?.data?.path);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load QR code or status.');
    } finally {
      setLoading(false);
    }
  };
  const statuswhatsapp = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await whatsappQrstatusEffect();
      if (response?.data?.data === 1) {
        console.log('User is already logged in.');
        SetIsLogin(true); // Set login status to true
      } else {
        console.log('User is not logged in, fetching QR code.');
        SetIsLogin(false);
        fetchData(); // Call get-qr API
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load QR code or status.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    setIsRegistered(true);
    fetchData();
  };

  const handleRefresh = () => {
    fetchData();
  };

  const toastOnclose = () => {
    setToastData({ ...toastData, show: false });
  };

  useEffect(() => {
    statuswhatsapp();
    if (isRegistered && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        fetchStatusData();
      }, 30000); 
    }
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRegistered, fetchStatusData]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {toastData?.show && (
        <AlertNotification
          show={toastData?.show}
          message={toastData?.message}
          type={toastData?.type}
          onClose={toastOnclose}
        />
      )}
      <div className="p-2 bg-white darkCardBg mb-2">
        <Breadcrumps items={breadcrumbItems} />
      </div>
      <div className="w-full rounded-lg shadow-md border bg-white flex flex-col h-full min-h-0 p-4">
        {islogin ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-700 text-lg mb-4">Already logged in</p>
          </div>
        ) : !isRegistered ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-700 text-lg mb-4">Please register to connect to WhatsApp.</p>
            <Button onClick={handleRegister} label={"Generate"} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            {loading ? (
              <Loader />
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src={qrCodeUrl}
                  alt="WhatsApp QR Code"
                  className="w-64 h-64 object-contain border border-gray-300 shadow-lg mb-4"
                />
                <Button onClick={handleRefresh} label={"Refresh QR Code"} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Whatsapp;