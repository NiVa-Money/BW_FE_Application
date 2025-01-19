import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';

interface CardProps {
    name: string;
    description: string;
    tone: string;
    fileName: string;
    color: string;
    createdAt: string;
    onDelete: () => void;
    onExport: () => void;
    onClick: () => void;
}

const MyBotCard: React.FC<CardProps> = ({
    name,
    description,
    tone,
    fileName,
    color,
    createdAt,
    onDelete,
    onExport,
    onClick
}) => {
    return (
        <div className="border border-gray-300 rounded-lg p-4 flex flex-col md:flex-row items-center md:items-start shadow-sm" onClick={onClick}>
            {/* Left Section - Avatar */}
            <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-gray-100">
                <img
                    src="/assets/bot1.svg"
                    alt={`${name} Avatar`}
                    className="w-full h-full rounded-full"
                />
            </div>

            {/* Middle Section - Details */}
            <div className="flex-grow md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                <h2 className="text-xl font-bold text-gray-800">{name}</h2>
                <p className="text-gray-500 text-sm">({description})</p>
                <div className="grid grid-cols-5 gap-2 mt-4 text-sm text-gray-700">

                    <div className='flex flex-col'>
                        <div className="font-semibold">Tone</div>
                        <div className="col-span-4">{tone}</div>
                    </div>
                    <div className='flex flex-col'>
                        <div className="font-semibold">File</div>
                        <div className="col-span-4">{fileName}</div>
                    </div>
                    <div className='flex flex-col'>

                        <div className="font-semibold">Color</div>
                        <div className="col-span-4 flex items-center">
                            <div
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: color }}
                            ></div>
                            {color}
                        </div>
                    </div>
                    <div className='flex flex-col'>

                        <div className="font-semibold">Created at</div>
                        <div className="col-span-4">{createdAt}</div>
                    </div>
                </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex mt-4 md:mt-0 space-x-4">
                <button
                    onClick={onDelete}
                    className="text-red-500 hover:text-red-700 flex items-center"
                >
                    <FaTrashAlt className="mr-1" />
                    Delete
                </button>
                <button
                    onClick={onExport}
                    className="text-green-500 hover:text-green-700 flex items-center"
                >
                    <FiDownload className="mr-1" />
                    Export
                </button>
            </div>
        </div>
    );
};

export default MyBotCard;
