import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import IosShareIcon from '@mui/icons-material/IosShare';
import EditIcon from '@mui/icons-material/Edit';
import { COLORS } from '../../constants';
interface CardProps {
    name: string;
    description: string;
    tone: string;
    fileName: string;
    color: string;
    createdAt: string;
    onDelete: () => void;
    onTest: () => void;
    onClick: () => void;
    onExport: () => void;
    image: string;
}

const MyBotCard: React.FC<CardProps> = ({
    name,
    description,
    tone,
    fileName,
    color,
    createdAt,
    onDelete,
    onTest,
    onClick,
    onExport,
    image

}) => {
    return (
        <div style={{ backgroundColor: `${COLORS.LIGHTGRAY}` }} className={`border border-gray-300 rounded-lg p-4 flexs md:flex-row w-[100%] items-center md:items-start shadow-sm`} >
            <div className="flex-shrink-0 flex items-center justify-between w-24 h-24 rounded-full bg-gray-100">
                <img
                    src={image?.length ? image : "/assets/bot1.svg"}
                    alt={`${name} Avatar`}
                    className="w-full h-full rounded-full"
                />
                <div className="flex mt-4 md:mt-0 space-x-4 flex-col">
                    <div className='ml-[16px]'>
                        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
                        <p className="text-gray-500 text-sm m-0">({description})</p>
                    </div>
                    <div className='flex justify-between gap-[20px] ml-0'>
                        <button
                            onClick={onDelete}
                            className="text-red-500 hover:text-red-700 flex items-center flex-col justify-end"
                        >
                            <FaTrashAlt />
                            <span>Delete</span>
                        </button>
                        <button
                            onClick={onClick}
                            className="text-green-500 hover:text-green-700 flex items-center flex-col justify-end"
                        >
                            <EditIcon />
                            <span>Edit</span>
                        </button>
                        <button
                            onClick={onTest}
                            className="text-grey-500 hover:text-grey-700 items-center flex flex-col justify-end"
                        >
                            <SettingsSuggestIcon />
                            <span>Test</span>
                        </button>
                        <button
                            onClick={onExport}
                            className="text-blue-500 hover:text-grey-700 items-center flex flex-col justify-end"
                        >
                            <IosShareIcon />
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Middle Section - Details */}
            <div className='flex'>
                <div className="flex-grow mt-4 md:mt-0 text-center md:text-left">

                    <div className="flex flex-col gap-2 mt-4 text-sm text-gray-700">

                        <div className='flex justify-between'>
                            <div className="font-semibold">Tone</div>
                            <div className="col-span-4">{tone}</div>
                        </div>
                        <div className='flex justify-between'>
                            <div className="font-semibold">File</div>
                            <div className="col-span-4">{fileName}</div>
                        </div>
                        <div className='flex justify-between'>

                            <div className="font-semibold">Color</div>
                            <div className="col-span-4 flex items-center">
                                <div
                                    className="w-4 h-4 rounded-full mr-2"
                                    style={{ backgroundColor: color }}
                                ></div>
                                {color}
                            </div>
                        </div>
                        <div className='flex justify-between'>

                            <div className="font-semibold">Created at</div>
                            <div className="col-span-4">{createdAt}</div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default MyBotCard;
