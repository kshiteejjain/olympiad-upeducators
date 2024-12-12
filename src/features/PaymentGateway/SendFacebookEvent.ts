// SendFacebookEvent.ts
export const sendFacebookEvent = (eventData: any, accessToken: string, pixelId: string) => {
    const url = `https://graph.facebook.com/v16.0/${pixelId}/events`; // Use v16.0 for broader compatibility
  
    const formData = new FormData();
    formData.append('data', JSON.stringify([eventData]));
    formData.append('access_token', accessToken);
  
    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Event sent successfully:', data);
      })
      .catch((error) => {
        console.error('Error sending event:', error);
      });
  };
  
  