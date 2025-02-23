import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => <ToastContainer autoClose={3000} />;

export const notifySuccess = (message: any) => toast.success(message);
export const notifyError = (message: any) => toast.error(message);

export default Toast;