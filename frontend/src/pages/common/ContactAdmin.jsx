import React from 'react';
import { Button, TextField } from '@mui/material';
import TextArea from '@mui/material/TextareaAutosize';

const ContactAdmin = () => {
  // State to manage form data (if needed)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Form submitted!');
  }

  return (
    <div className="p-20">
      <h1 className="text-2xl font-bold mb-6">Contact Admin</h1>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4">
        <TextField
          label="Subject"
          variant="outlined"
          fullWidth
          margin="normal"
          className="mb-4"
          required
        />
        <TextArea
          placeholder="Message"
          className="m-1 w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          minRows={4}
          required
        />
        <div className='w-full flex justify-end'>
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: '#4C7E75', color: 'white' }}
            className="mx-4"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactAdmin;
