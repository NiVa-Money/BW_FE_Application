import React from 'react';
import { StatsCard } from '../DashboardNew/DashboardPanel';
import { Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { COLORS } from '../../constants';

const Settings: React.FC = () => {


    const processedStats =
        [
            {
                title: "Total Number of Employees",
                content: `100`,
            },
            {
                title: "Active Logs",
                content: `5`,
            },
            {
                title: "Managers",
                content: `13`,
            },
            {
                title: "Supervisors",
                content: `10`,
            }
        ];
    const userListing = [{
        name: 'sudhanshu',
        emailId: 'batrasudhanshu09@gmail.com',
        role: 'Developer',
        id: '1'
    }, {
        name: 'sudhanshu',
        emailId: 'batrasudhanshu09@gmail.com',
        role: 'Developer',
        id: '2'
    }, {
        name: 'sudhanshu',
        emailId: 'batrasudhanshu09@gmail.com',
        role: 'Developer',
        id: '3'
    }, {
        name: 'sudhanshu',
        emailId: 'batrasudhanshu09@gmail.com',
        role: 'Developer',
        id: '4'
    }]

    return (
        <div className='flex flex-col w-[100%] p-6'>
            <div className='flex justify-between items-center'>
                <h1 className="text-xl font-semibold">User & Role Management</h1>

            </div>
            <div className="flex justify-between items-center my-4 gap-4 ">

                {processedStats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        content={stat.content}
                        bgColor={`${COLORS.LIGHTGRAY}`}
                    />
                ))}
            </div>
            <button className={`self-end bg-[${COLORS.VIOLET}] text-white p-1 w-[100px] rounded-[100px] `} onClick={() => { }}>Add User</button>
            <div className="flex  flex-col justify-between items-center my-4 gap-4 ">

                {userListing.map((item, index) => (
                    <Paper
                        key={index}
                        className="flex-grow"
                        sx={{
                            p: 1.25,
                            borderRadius: 2,
                            backgroundColor: "#fdf9ff",
                            display: "flex",
                            width: '100%'
                        }}
                    ><div className='flex w-full justify-between items-center'>
                            <div className='flex flex-col '><span> {item.name}</span><span> {item.emailId}</span></div>
                            <div>{item.role}</div>
                            <div className='flex gap-2 items-center justify-center'>
                                <button className='self-end bg-[#65558F] text-white p-1 w-[75px] rounded-[100px] ' onClick={() => { }}>Edit</button>
                                <button className='' onClick={() => { }}> <DeleteIcon color={'error'} /></button>


                            </div>
                        </div></Paper>
                ))}
            </div>
        </div>



    );
};

export default Settings;
