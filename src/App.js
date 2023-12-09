import React, { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import './App.css';
import {
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Modal, Button as SUIButton, Form } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
const App = () => {
  const [formData, setFormData] = useState({
    ehrmsCode: '',
    teacherName: '',
    mobileNumber: '',
    udiseCode: '',
    schoolName: '',
    nyayPanchayat: '',
    schoolType: '',
    Class: '',
    scBoys: '',
    scGirls: '',
    obcBoys: '',
    obcGirls: '',
    genBoys: '',
    genGirls: '',
    urduBoys: '',
    urduGirls: '',
    totalBoys: '',
    totalGirls: '',
    enrollments: '',
  });
  const initialFormData = {
    ehrmsCode: '',
    teacherName: '',
    mobileNumber: '',
    udiseCode: '',
    schoolName: '',
    nyayPanchayat: '',
    schoolType: '',
    Class: '',
    scBoys: '',
    scGirls: '',
    obcBoys: '',
    obcGirls: '',
    genBoys: '',
    genGirls: '',
    urduBoys: '',
    urduGirls: '',
    totalBoys: '',
    totalGirls: '',
    enrollments: '',
  };
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(initialFormData);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const handleEdit = (index) => {
    setEditModalOpen(true);
    setEditRowIndex(index);
    // Populate the editFormData with the data of the row to be edited
    setEditFormData(tableData[index]);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditRowIndex(null);
    setEditFormData(initialFormData);
  };
  const handleSaveEdit = () => {
    // Update the tableData with the edited data
    const updatedTableData = [...tableData];
    updatedTableData[editRowIndex] = editFormData;
    setTableData(updatedTableData);

    // Close the edit modal
    handleCloseEditModal();
  };
  // Define a function to handle changes in the form fields inside the edit modal
  const handleEditFormChange = (e, fieldName) => {
    const { value } = e.target;
    // Update the editFormData with the new value for the specified field
    setEditFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const validateFormData = () => {
    const Fields = [
      'ehrmsCode',
      'teacherName',
      'mobileNumber',
      'udiseCode',
      'schoolName',
      'nyayPanchayat',
      'schoolType',
      'Class',
      'scBoys',
      'scGirls',
      'obcBoys',
      'obcGirls',
      'genBoys',
      'genGirls',
      'urduBoys',
      'urduGirls',
      'totalBoys',
      'totalGirls',
      'enrollments',
    ];

    for (const field of Fields) {
      if (!formData[field]) {
        return false; // Validation failed
      }
    }

    return true; // Validation passed
  };

  // Add Data button click handler

  const handleDelete = (indexToDelete) => {
    // Filter out the row with the specified index
    const updatedTableData = tableData.filter((_, index) => index !== indexToDelete);

    // Update the tableData state with the filtered data
    setTableData(updatedTableData);
  };
  const [tableData, setTableData] = useState([]);
  const RomanNumerals = {
    toRoman: (num) => {
      const romanNumerals = [
        'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII',
      ];
      return romanNumerals[num - 1] || '';
    },
  };

  useEffect(() => {
    const {
      scBoys,
      obcBoys,
      genBoys,
      urduBoys,
    } = formData;
    const scBoysValue = parseInt(scBoys) || 0;
    const obcBoysValue = parseInt(obcBoys) || 0;
    const genBoysValue = parseInt(genBoys) || 0;
    const urduBoysValue = parseInt(urduBoys) || 0;
    const totalBoysValue =
      scBoysValue + obcBoysValue + genBoysValue + urduBoysValue;

    // Update the state with the calculated total
    setFormData((prevData) => ({
      ...prevData,
      totalBoys: totalBoysValue.toString(),
    }));
  }, [formData, formData.scBoys, formData.obcBoys, formData.genBoys, formData.urduBoys]);

  useEffect(() => {
    const {
      scGirls,
      obcGirls,
      genGirls,
      urduGirls,
    } = formData;
    const scGirlsValue = parseInt(scGirls) || 0;
    const obcGirlsValue = parseInt(obcGirls) || 0;
    const genGirlsValue = parseInt(genGirls) || 0;
    const urduGirlsValue = parseInt(urduGirls) || 0;
    const totalGirlsValue =
      scGirlsValue + obcGirlsValue + genGirlsValue + urduGirlsValue;

    // Update the state with the calculated total
    setFormData((prevData) => ({
      ...prevData,
      totalGirls: totalGirlsValue.toString(),
    }));
  }, [formData, formData.scGirls, formData.obcGirls, formData.genGirls, formData.urduGirls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [loading, setLoading] = useState(false);

  const delayedFetchTeacherData = useRef(
    debounce((value) => {
      fetchTeacherData(value);
    }, 1000)
  ).current;

  const delayedFetchSchoolData = useRef(
    debounce((value) => {
      fetchSchoolData(value);
    }, 1000)
  ).current;

  useEffect(() => {

    if (formData.ehrmsCode) {
      delayedFetchTeacherData(formData.ehrmsCode);
    }
  }, [formData.ehrmsCode, delayedFetchTeacherData]);

  useEffect(() => {
    if (formData.udiseCode) {
      delayedFetchSchoolData(formData.udiseCode);
    }
  }, [formData.udiseCode, delayedFetchSchoolData]);

  const fetchTeacherData = async (ehrmsCode) => {
    try {
      setLoading(true);

      // Fetch teacher data based on EHRMS CODE
      const teacherResponse = await axios.get(
        `https://script.google.com/macros/s/AKfycbyUbzgUn16dvz87D8DIZhWAHqza7qDY9FwygQPPF0ij_qqLomgjPvXN5T3JbUJG3iMS/exec?ehrmsCode=${ehrmsCode}&sheet=Sheet1`
      );

      if (teacherResponse.data.data.length > 0) {
        const teacherData = teacherResponse.data.data[0];
        const teacherName = teacherData.teacherName;
        // Update the state with teacher data
        setFormData((prevData) => ({
          ...prevData,
          teacherName,
        }));
      } else {
        // Handle case where teacher data is not found
        setFormData((prevData) => ({
          ...prevData,
          teacherName: '', // Clear teacherName
        }));

        // Display a ToastContainer message for invalid EHRMS CODE
        toast.error('Invalid EHRMS CODE', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);

      // Display a ToastContainer message for the error
      toast.error('Error fetching teacher data', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolData = async (udiseCode) => {
    try {
      setLoading(true);

      // Fetch school data based on UDISE CODE
      const udiseResponse = await axios.get(
        `https://script.google.com/macros/s/AKfycbyUbzgUn16dvz87D8DIZhWAHqza7qDY9FwygQPPF0ij_qqLomgjPvXN5T3JbUJG3iMS/exec?sheet=Sheet2&udiseCode=${udiseCode}`
      );

      if (udiseResponse.data.data.length > 0) {
        const schoolData = udiseResponse.data.data[0];
        const nyayPanchayat = schoolData.nyayPanchayat;
        const schoolName = schoolData.schoolName;
        const schoolType = schoolData.schoolType;

        // Update the state with school data
        setFormData((prevData) => ({
          ...prevData,
          nyayPanchayat,
          schoolName,
          schoolType,
        }));
      } else {
        // Handle case where school data is not found
        setFormData((prevData) => ({
          ...prevData,
          nyayPanchayat: '', // Clear nyayPanchayat
          schoolName: '', // Clear schoolName
          schoolType: '', // Clear schoolType
        }));

        // Display a ToastContainer message for invalid UDISE CODE
        toast.error('Invalid UDISE CODE', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error fetching school data:', error);

      // Display a ToastContainer message for the error
      toast.error('Error fetching school data', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Send a POST request to the Google Apps Script API to add the data
      for (const row of tableData) {
        console.log({params: row});
        const response = await axios.get(
          `https://script.google.com/macros/s/AKfycbyI_Ex0g5zXdO1sGNs4RsX4Z-C7gf0emSC6W_EfR_EC5Yfm3UemZVqUt8sYeCvvOsbq/exec?sheet=Sheet1`,
          { params: row }
        );
        if (response.status === 200) {
          setFormData({
            ehrmsCode: '',
            teacherName: '',
            mobileNumber: '',
            udiseCode: '',
            schoolName: '',
            nyayPanchayat: '',
            schoolType: '',
            Class: '',
            scBoys: '',
            scGirls: '',
            obcBoys: '',
            obcGirls: '',
            genBoys: '',
            genGirls: '',
            urduBoys: '',
            urduGirls: '',
            totalBoys: '',
            totalGirls: '',
            enrollments: '',
          });
          setTableData(() => []);
          // Display a success notification
        } else {
          alert('Error submitting data. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data. Please try again.');
    } finally {
      toast.success('Data saved successfully!', {
        position: 'top-right',
        autoClose: 3000, // Close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false); // Stop loading
    }
  };
  const handleAddData = () => {
    const isFormDataValid = validateFormData();

    if (isFormDataValid) {
      // Create a new object by copying the current formData
      const newFormData = { ...formData };

      // Reset the fields below the "Student Data" heading to their initial values
      newFormData.Class = initialFormData.Class;
      newFormData.scBoys = initialFormData.scBoys;
      newFormData.scGirls = initialFormData.scGirls;
      newFormData.obcBoys = initialFormData.obcBoys;
      newFormData.obcGirls = initialFormData.obcGirls;
      newFormData.genBoys = initialFormData.genBoys;
      newFormData.genGirls = initialFormData.genGirls;
      newFormData.urduBoys = initialFormData.urduBoys;
      newFormData.urduGirls = initialFormData.urduGirls;
      newFormData.totalBoys = initialFormData.totalBoys;
      newFormData.totalGirls = initialFormData.totalGirls;
      newFormData.enrollments = initialFormData.enrollments;

      // Add the current form data to the table data state
      setTableData((prevTableData) => [...prevTableData, formData]);

      // Clear the form data by updating the formData state with the newFormData
      setFormData(newFormData);
    } else {
      // Display a message or disable the button because validation failed
      alert('Please fill in all fields.');
    }
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the screen width is less than or equal to 768 pixels (you can adjust this value)
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check when the component mounts
    checkIsMobile();

    // Attach the event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px' }}>
      <Grid item xs={12}>
      <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: isMobile ? '40px' : '70px', fontWeight: 'bold' }}>BASIC EDUCATION SWAR</h1>
          </div>
          <hr></hr>
        </Grid>
        <Grid item xs={12}><div style={{ textAlign: 'center' }}>
          <h1>School Data</h1>
        </div>
        </Grid>
        <form onSubmit={handleSubmit} style={{ opacity: loading ? 0.5 : 1,}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="EHRMS CODE"
                variant="outlined"
                name="ehrmsCode"
                value={formData.ehrmsCode}
                onChange={handleChange}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="TEACHER NAME"
                variant="outlined"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleChange}
                disabled // Field is always disabled

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="MOBILE NUMBER"
                variant="outlined"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="UDISE CODE"
                variant="outlined"
                name="udiseCode"
                value={formData.udiseCode}
                onChange={handleChange}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SCHOOL NAME"
                variant="outlined"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}

                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="NYAY PANCHAYAT"
                variant="outlined"
                name="nyayPanchayat"
                value={formData.nyayPanchayat}
                onChange={handleChange}

                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SCHOOL TYPE"
                variant="outlined"
                name="schoolType"
                value={formData.schoolType}
                onChange={handleChange}

                disabled
              />
            </Grid>
            <Grid item xs={12}><div style={{ textAlign: 'center' }}>
              <h1>Student Data</h1>
            </div>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="CLASS"
                variant="outlined"
                name="Class"
                value={formData.Class}
                onChange={handleChange}

              >
                {Array.from({ length: 7 }, (_, i) => (
                  <MenuItem key={i + 1} value={String(i + 1)}>
                    {`${RomanNumerals.toRoman(i + 1)}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SC BOYS"
                variant="outlined"
                name="scBoys"
                value={formData.scBoys}
                onChange={handleChange}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SC GIRLS"
                variant="outlined"
                name="scGirls"
                value={formData.scGirls}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}
                onChange={handleChange}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="OBC BOYS"
                variant="outlined"
                name="obcBoys"
                value={formData.obcBoys}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}
                onChange={handleChange}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="OBC GIRLS"
                variant="outlined"
                name="obcGirls"
                value={formData.obcGirls}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}
                onChange={handleChange}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="GEN BOYS"
                variant="outlined"
                name="genBoys"
                value={formData.genBoys}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}
                onChange={handleChange}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="GEN GIRLS"
                variant="outlined"
                name="genGirls"
                value={formData.genGirls}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}
                onChange={handleChange}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URDU BOYS"
                variant="outlined"
                name="urduBoys"
                value={formData.urduBoys}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}
                onChange={handleChange}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URDU GIRLS"
                variant="outlined"
                name="urduGirls"
                value={formData.urduGirls}
                onChange={handleChange}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="TOTAL BOYS"
                variant="outlined"
                name="totalBoys"
                value={formData.totalBoys}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}
                onChange={handleChange}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="TOTAL GIRLS"
                variant="outlined"
                name="totalGirls"
                value={formData.totalGirls}
                onChange={handleChange}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ENROLLMENTS"
                variant="outlined"
                name="enrollments"
                value={formData.enrollments}
                onChange={handleChange}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*', // Only allows numeric input
                }}

              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddData}
              >
                Add Data
              </Button>
            </Grid>
            <div style={{ overflowX: 'auto' }}>
              <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>CLASS</TableCell>
                      <TableCell>SC BOYS</TableCell>
                      <TableCell>SC GIRLS</TableCell>
                      <TableCell>OBC BOYS</TableCell>
                      <TableCell>OBC GIRLS</TableCell>
                      <TableCell>GEN BOYS</TableCell>
                      <TableCell>GEN GIRLS</TableCell>
                      <TableCell>URDU BOYS</TableCell>
                      <TableCell>URDU GIRLS</TableCell>
                      <TableCell>TOTAL BOYS</TableCell>
                      <TableCell>TOTAL GIRLS</TableCell>
                      <TableCell>ENROLLMENTS</TableCell>
                      <TableCell>Actions</TableCell> {/* Add Actions column header */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.Class}</TableCell>
                        <TableCell>{row.scBoys}</TableCell>
                        <TableCell>{row.scGirls}</TableCell>
                        <TableCell>{row.obcBoys}</TableCell>
                        <TableCell>{row.obcGirls}</TableCell>
                        <TableCell>{row.genBoys}</TableCell>
                        <TableCell>{row.genGirls}</TableCell>
                        <TableCell>{row.urduBoys}</TableCell>
                        <TableCell>{row.urduGirls}</TableCell>
                        <TableCell>{row.totalBoys}</TableCell>
                        <TableCell>{row.totalGirls}</TableCell>
                        <TableCell>{row.enrollments}</TableCell>
                        <TableCell>
                          {/* <Button onClick={() => handleEdit(row)}>Edit</Button> */}
                          <Button onClick={() => handleEdit(index)}>Edit</Button>
                          <Button onClick={() => handleDelete(index)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </div>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                disabled={loading} // Disable the button during loading
              >
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </form>
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0)', // Semi-transparent white background
            }}
          >

            <CircularProgress />
          </div>
        )}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Modal
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          size="small"
        >
          <Modal.Header>Edit Data</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                label="CLASS"
                name="Class"
                value={editFormData.Class}
                onChange={(e) => handleEditFormChange(e, 'Class')}
              />
              <Form.Input
                label="SC BOYS"
                name="scBoys"
                value={editFormData.scBoys}
                onChange={(e) => handleEditFormChange(e, 'scBoys')}
              />
              <Form.Input
                label="SC GIRLS"
                name="scGirls"
                value={editFormData.scGirls}
                onChange={(e) => handleEditFormChange(e, 'scGirls')}
              />
              <Form.Input
                label="OBC BOYS"
                name="obcBoys"
                value={editFormData.obcBoys}
                onChange={(e) => handleEditFormChange(e, 'obcBoys')}
              />
              <Form.Input
                label="OBC GIRLS"
                name="obcGirls"
                value={editFormData.obcGirls}
                onChange={(e) => handleEditFormChange(e, 'obcGirls')}
              />
              <Form.Input
                label="GEN BOYS"
                name="genBoys"
                value={editFormData.genBoys}
                onChange={(e) => handleEditFormChange(e, 'genBoys')}
              />
              <Form.Input
                label="GEN GIRLS"
                name="genGirls"
                value={editFormData.genGirls}
                onChange={(e) => handleEditFormChange(e, 'genGirls')}
              />
              <Form.Input
                label="URDU BOYS"
                name="urduBoys"
                value={editFormData.urduBoys}
                onChange={(e) => handleEditFormChange(e, 'urduBoys')}
              />
              <Form.Input
                label="URDU GIRLS"
                name="urduGirls"
                value={editFormData.urduGirls}
                onChange={(e) => handleEditFormChange(e, 'urduGirls')}
              />
              <Form.Input
                label="TOTAL BOYS"
                name="totalBoys"
                value={editFormData.totalBoys}
                onChange={(e) => handleEditFormChange(e, 'totalBoys')}
              />
              <Form.Input
                label="TOTAL GIRLS"
                name="totalGirls"
                value={editFormData.totalGirls}
                onChange={(e) => handleEditFormChange(e, 'totalGirls')}
              />
              <Form.Input
                label="ENROLLMENTS"
                name="enrollments"
                value={editFormData.enrollments}
                onChange={(e) => handleEditFormChange(e, 'enrollments')}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <SUIButton color="primary" onClick={handleSaveEdit}>
              Save
            </SUIButton>
            <SUIButton color="secondary" onClick={handleCloseEditModal}>
              Cancel
            </SUIButton>
          </Modal.Actions>
        </Modal>
      </Paper>
    </Container>
  );
};
export default App;
