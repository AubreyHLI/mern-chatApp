import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSignupUserMutation } from '../redux/services/appApi';
import { addAvatarPicture } from '../redux/slices/userSlice';
import { useDispatch } from 'react-redux';


const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const [signupUser, { isLoading, error }] = useSignupUserMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    // show image
    const validateImg = (e) => {
        const file = e.target.files[0];
        if (file.size >= 1048576) {
            return alert('Max file size is 1mb');
        } else {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    // upload image to cloudinary
    const uploadImage = async () => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 's9bxirgt');
        try {
            setUploadingImg(true);
            let response = await fetch('https://api.cloudinary.com/v1_1/dewmfc2io/image/upload', {
                method: 'POST',
                body: data
            });
            const urlData = await response.json();
            setUploadingImg(false);
            return urlData.url;
        } catch(error) {
            setUploadingImg(false);
            console.log(error);
        }
    }


    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response  = await signupUser({name, email, password});
            if(response.data && image) {
                const url = await uploadImage();
                console.log(url);
                dispatch(addAvatarPicture(url));
                navigate('/chat');
            }
        } catch(err) {
            console.log(err);
        }
    }
    

  return (
    <Form className='signup' onSubmit={handleSignup}>
        <h1 className='text-center'>Create account</h1>
        <div className='signup-profile-avatar_container'>
            <Avatar alt='' src={imagePreview} className='signup-profile-avatar'/>
            <label htmlFor='image-upload' className='image-upload-label'>
                <AddCircleIcon className='add-avatar-icon'/>
            </label>
            <input type="file" id="image-upload" hidden accept="image/png, image/jpeg, image/jpg" onChange={validateImg} />
        </div>

        {error && <p className='alert alert-danger'>{error.data}</p>}

        <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
        </Form.Group>
        <Button variant="primary" type="submit">
            {uploadingImg || isLoading ? 'Signing you up .....' : 'Signup'}
        </Button>

        <div className='py-4'>
            <p className='text-center'>
                Already have an account ? <Link to='/login'>Login</Link>
            </p>
        </div>
    </Form>  
  )
}

export default Signup