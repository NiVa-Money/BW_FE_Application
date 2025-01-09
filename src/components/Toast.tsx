import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => <ToastContainer />;

export const notifySuccess = (message: any) => toast.success(message);
export const notifyError = (message: any) => toast.error(message);

export default Toast;