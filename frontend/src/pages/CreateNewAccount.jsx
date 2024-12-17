import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebSocketContext, useSendMessage, useWebSocket } from '../contexts/WebSocketContext';
import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Button,
  Avatar,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  IconButton,
  InputAdornment,
  OutlinedInput,
  LinearProgress,
  Snackbar
} from '@mui/material';
import { ArrowBackOutlined, CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import GrapseeImage from '../assets/grapsee.png'
import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';

const CreateNewAccount = () => {

  const { token } = useAppContext();

  const [error, setError] = useState(null);
  const [inputKey, setInputKey] = useState(Date.now());
  const [profileImageFile, setProfileImageFile] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const [step, setStep] = useState(1);
  const [checkbox, setCheckbox] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    profile: '',
    name: '',
    email: '',
    profession: 'Student',
    gender: 'Male',
    day: 16,
    month: 6,
    year: 2002,
    password: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');

  const isStep1Valid = newUser.name.trim() !== '' && newUser.email.trim() !== '' && checkbox;
  const isStep2Valid = newUser.profession.trim() !== '' && newUser.gender.trim() !== '' && newUser.day !== '' && newUser.month !== '' && newUser.year !== '';
  const isStep3Valid = newUser.password.trim() !== '' && newUser.confirmPassword.trim() !== '' && newUser.password === newUser.confirmPassword;

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const isDesktop = useMediaQuery('(min-width:960px)');

  const ws = useWebSocket();
  const sendMessage = useSendMessage();

  const navigate = useNavigate();

  useEffect(() => {
    if(token){
      setStep(prevStep => prevStep + 1);
      setLoading(false);
    }
  }, [token]);

  const handleNextStep = async () => {
    if (step === 3 && !isStep3Valid) {
      setPasswordError('Passwords do not match');
    } else if (step === 4) {
      setLoading(true);
      const profile = await handleUpload(profileImageFile);
      const dateOfBirth = `${newUser.day} ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][newUser.month - 1]}, ${newUser.year}`;
      sendMessage('REGISTER', { ...newUser, profile, dateOfBirth });
    } else if (step === 5) {
      navigate('../grapsee');
    } else {
      setPasswordError('');
      setStep(prevStep => prevStep < 5 ? prevStep + 1 : prevStep);
    }
  };

  const handlePreviousStep = () => {
    setStep(prevStep => prevStep > 1 ? prevStep - 1 : prevStep);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setNewUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));

  };

  const handleMonthChange = (event) => {
    const { value } = event.target;
    setNewUser(prevUser => ({
      ...prevUser,
      month: value,
      // day: ''
    }));
  };

  const handleDayChange = (event) => {
    const { value } = event.target;
    setNewUser(prevUser => ({
      ...prevUser,
      day: value
    }));
  };

  const handleYearChange = (event) => {
    const { value } = event.target;
    setNewUser(prevUser => ({
      ...prevUser,
      year: value
    }));
  };

  const handleCheckboxChange = () => {
    setCheckbox(!checkbox);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const generateDayOptions = () => {
    const { month, year } = newUser;
    if (month === '' || year === '') return [];

    const numDays = getDaysInMonth(month, year);
    return Array.from({ length: numDays }, (_, index) => index + 1);
  };


  const handleProfileImageFileChange = (event) => {
    setProfileImageFile(event.target.files[0]);
    setInputKey(Date.now());
  };

  const handleUpload = async (selectedFile) => {
    if (!selectedFile) return ''
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('File uploaded successfully:', response.data);
      return response.data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Card elevation={8} style={{ width: isMobile ? '310px' : '330px', maxWidth: isMobile ? '310px' : '330px' }}>
          {isLoading && <LinearProgress />}
          <CardContent>
            <h3 style={{ fontWeight: 'normal', marginBottom: '5px' }}>Step {step} of 5</h3>
            <Divider />
            {step === 1 && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
                  <label htmlFor="profile-pic-input">
                    <Avatar variant="outlined" sx={{ width: 60, height: 60, cursor: 'pointer' }}>
                      {profileImageFile ? <img src={URL.createObjectURL(profileImageFile)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'A'}
                    </Avatar>
                  </label>
                  <input type="file" id="profile-pic-input" accept="image/*" style={{ display: 'none' }} key={inputKey} onChange={handleProfileImageFileChange} />
                  <i style={{ fontSize: 14, marginTop: 5 }}>Tap to change profile</i>
                </div>
                <TextField label="Name" name="name" type="text" fullWidth margin="normal" value={newUser.name} onChange={handleChange} />
                <TextField label="Email" name="email" type="email" fullWidth margin="normal" value={newUser.email} onChange={handleChange} />
                <Divider style={{ marginBottom: 20 }} />
                <FormControlLabel
                  control={<Checkbox checked={checkbox} onChange={handleCheckboxChange} />}
                  label="I agree to"
                />
                <a href="" target="_blank" rel="noopener noreferrer">terms and conditions</a>
              </>
            )}
            {step === 2 && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="profession-select-label">Profession</InputLabel>
                  <Select
                    labelId="profession-select-label"
                    id="profession-select"
                    label="Profession"
                    name="profession"
                    value={newUser.profession}
                    onChange={handleChange}
                  >
                    {['Student', 'Teacher', 'Doctor', 'Artists', 'Job worker', 'Business man', 'Politician', 'House wife', 'Freelancer', 'Others'].map((profession, index) => (
                      <MenuItem key={index} value={profession}>{profession}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="gender-select-label">Gender</InputLabel>
                  <Select
                    labelId="gender-select-label"
                    id="gender-select"
                    label="Gender"
                    name="gender"
                    value={newUser.gender}
                    onChange={handleChange}
                  >
                    {['Male', 'Female', 'Others'].map((gender, index) => (
                      <MenuItem key={index} value={gender}>{gender}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <b>Date of birth:</b>
                <div style={{ width: '100%', display: 'flix', justifyContent: 'center' }}>
                  <FormControl style={{ width: '30%', marginLeft: '2%' }} margin="normal">
                    <InputLabel id="day-select-label">Day</InputLabel>
                    <Select
                      labelId="day-select-label"
                      id="day-select"
                      label="Day"
                      name="day"
                      value={newUser.day}
                      onChange={handleDayChange}
                    >
                      {generateDayOptions().map((day, index) => (
                        <MenuItem key={index} value={day}>{day}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl style={{ width: '30%', marginLeft: '3%' }} margin="normal">
                    <InputLabel id="month-select-label">Month</InputLabel>
                    <Select
                      labelId="month-select-label"
                      id="month-select"
                      label="Month"
                      name="month"
                      value={newUser.month}
                      onChange={handleMonthChange}
                    >
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                        <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl style={{ width: '30%', marginLeft: '3%' }} margin="normal">
                    <InputLabel id="year-select-label">Year</InputLabel>
                    <Select
                      labelId="year-select-label"
                      id="year-select"
                      label="Year"
                      name="year"
                      value={newUser.year}
                      onChange={handleYearChange}
                    >
                      {Array.from({ length: 100 }, (_, index) => (
                        <MenuItem key={index} value={2023 - index}>{2023 - index}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </>
            )}
            {step === 3 && (
              <>

                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel htmlFor="outlined-password">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={(event) => {
                            event.preventDefault();
                          }}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    name='password'
                    value={newUser.password}
                    onChange={handleChange}
                  />
                </FormControl>


                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel htmlFor="outlined-confirm-password">Confirm Password</InputLabel>
                  <OutlinedInput
                    id="outlined-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={(event) => {
                            event.preventDefault();
                          }}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                    name='confirmPassword'
                    value={newUser.confirmPassword}
                    onChange={handleChange}
                  />
                </FormControl>
                <p style={{ color: 'red' }}>{passwordError}</p>
                <p style={{ color: '#616161' }}>Please enter a password for your account</p>
              </>
            )}
            {step === 4 && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar variant="outlined" sx={{ mt: '2px', width: 50, height: 50, cursor: 'pointer' }}>
                    {profileImageFile ? <img src={URL.createObjectURL(profileImageFile)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'A'}
                  </Avatar>
                  <FormControl disabled fullWidth variant="outlined" margin="normal">
                    <InputLabel>Name</InputLabel>
                    <OutlinedInput type={'text'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton color='success' edge="end">
                            <CheckCircle />
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Name"
                      value={newUser.name}
                    />
                  </FormControl>

                  <FormControl disabled fullWidth variant="outlined" margin="normal">
                    <InputLabel>Email</InputLabel>
                    <OutlinedInput
                      type={'text'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton color='success' edge="end">
                            <CheckCircle />
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Email"
                      value={newUser.email}
                    />
                  </FormControl>

                  <FormControl disabled fullWidth variant="outlined" margin="normal">
                    <InputLabel>Profession</InputLabel>
                    <OutlinedInput
                      type={'text'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton color='success' edge="end">
                            <CheckCircle />
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Profession"
                      value={newUser.profession}
                    />
                  </FormControl>

                  <FormControl disabled fullWidth variant="outlined" margin="normal">
                    <InputLabel>Date of birth</InputLabel>
                    <OutlinedInput
                      type={'text'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton color='success' edge="end">
                            <CheckCircle />
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Date of birth"
                      value={`${newUser.day} ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][newUser.month - 1]}, ${newUser.year}`}
                    />
                  </FormControl>
                </div>
              </>
            )}
            {step === 5 && (
              <div style={{ padding: 16, textAlign: 'center' }}>
                <img style={{ height: '75px', width: '75px', margin: '20px' }} src={GrapseeImage} alt='Grapsee' />
                <h3 style={{ fontWeight: 'lighter', marginBottom: 10 }}>Welcome to Grapsee</h3>
                <span style={{ color: '#9e9e9e' }}>Thanks for your account creation!</span>
              </div>
            )}
          </CardContent>
          <Divider />
          <CardActions>
            {step > 1 && step !== 5 && (
              <IconButton color='primary' onClick={handlePreviousStep}>
                <ArrowBackOutlined />
              </IconButton>
            )}
            <div style={{ flex: 1 }} />
            <Button color="primary" onClick={handleNextStep} disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)}>
              {step === 4 ? 'Create account' : step === 5 ? 'Go' : 'Next'}
            </Button>
          </CardActions>
        </Card>

      </div>
      <Snackbar
        open={error !== null}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </>
  );
};

export default CreateNewAccount;
