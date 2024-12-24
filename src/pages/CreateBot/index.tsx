import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CreateBotRightContainer from './CreateBotRightContainer';
import { TextField } from '@mui/material';
import FormikFieldChipComponent from '../../components/FormikFieldChipComponent';
import FormikFieldToggleComponent from '../../components/FormikFieldToggleComponent';
import FormikFieldInputComponent from '../../components/FormikFieldInputComponent';

interface FormValues {
  name: string;
  email: string;
}
const CreateBot: React.FC = () => {

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
  });
  const initialValues: FormValues = {
    name: '',
    email: '',
  };  const handleSubmit = (values: FormValues) => {
    // Handle form submission logic here
    console.log('Form Submitted:', values);
  };

  return (
    <div className='m-[15px] max-w-[1400px] h-[100vh] w-[100vw] mx-[auto] my-[0]  flex justify-center items-center '>
       <Formik
       
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="w-[95%] m-auto h-[95%] grid grid-cols-[60%_40%]">
          <left-container className="bg-blue">
            <div className="flex-col">
            <div className=" flex flex-col" >
            <label htmlFor="name">Bot Name</label>
           
            <Field
              type="text"
              id="name"
              name="name"
              
              placeholder="Enter your Bot Name"
              component={FormikFieldInputComponent}
              
            />
            </div>
            <div className=" flex flex-col" >
            <label htmlFor="theme">Choose theme</label>
           
            <Field
              name="mood"
              component={FormikFieldChipComponent}
              options={[
                { label: 'Light', value: 'light'  },
                { label: 'Dark', value: 'dark'},
              ]}
            />
            </div>
            <div className=" flex flex-col" >
            <label htmlFor="botTone">Bot Tone</label>
           
            <Field
               name="botTone"
               component={FormikFieldToggleComponent}
               options={[
                 { label: 'Formal Tone', value: 'formal' },
                 { label: 'Casual Tone', value: 'casual' },
                 { label: 'Enthusiastic Tone', value: 'enthusiastic' },
               ]}
            />
            </div>
            <div className=" flex flex-col" >
            <label htmlFor="botFont">Bot Tone</label>
           
            <Field
               name="botFont"
               component={FormikFieldToggleComponent}
               options={[
                 { label: 'Poppins', value: 'Poppins' },
                 { label: 'Montserrat', value: 'Montserrat' },
                 { label: 'Times Roman', value: 'Times Roman' },
               ]}
            />
            </div>
            <div className=" flex flex-col" >
            <label htmlFor="greetingMessage">Bot Greeting Message</label>
           
            <Field
              type="text"
              id="greetingMessage"
              name="greetingMessage"
              placeholder="Enter your Bot Name"
              component={FormikFieldInputComponent}
              
            />
            </div>
            <div className=" flex flex-col" >
            <label htmlFor="botIdentity">Bot Identity</label>
           
            <Field
              type="text"
              id="name"
              name="botIdentity"
              placeholder="Enter your Bot Name"
              component={FormikFieldInputComponent}
              
            />
            </div>
            </div>
          </left-container>
          <CreateBotRightContainer botName='Botwot Assistant'/>
          {/* <div>
            <label htmlFor="name">Name</label>
            <Field
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
            />
            <ErrorMessage name="name" component="div" className="error" />
          </div> */}

          {/* <div>
            <label htmlFor="email">Email</label>
            <Field
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
            />
            <ErrorMessage name="email" component="div" className="error" />
          </div> */}

          {/* <button type="submit">Submit</button> */}
        </Form>
      )}
    </Formik>
    </div>

  );
};

export default CreateBot;
