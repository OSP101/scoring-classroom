import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Autocomplete, AutocompleteItem, Avatar, Button, dateInput, Input, ModalBody, ModalFooter, Spinner } from "@nextui-org/react";
import { Prompt } from "next/font/google";
import { SearchIcon } from '../Icons/SearchIcon';
import { useSession } from "next-auth/react"
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export default function FormExtra(idcourse: any) {

    interface Students {
        stdid: string;
        name: string;
        image: string
    }
    const { data: session, status } = useSession();
    const [dataUser, setDataUser] = useState<Students[]>([]);
    const [inputData, setInputData] = useState('');
    const [idTeach, setIdTeach] = useState(session?.user?.stdid)
    const point = 1;
    const idc = idcourse.idcourse;
    const [open, setOpen] = React.useState(false);
    const [dataAlert, setDataAlert] = useState("");
    const [statusUpdate, setStatusUpdate] = useState(false);



    useEffect(() => {
        getUser("0", idcourse.idcourse);
    }, [])

    const getUser = async (stdid: string, idcourse: string) => {
        try {
            const data = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/score/getuser`,
                { stdid, idcourse },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                    }
                });

            setDataUser(data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.message);
            } else {
                console.log('An unexpected error occurred');
            }
        }
    }

    const onInputChange = (value: string) => {
        setInputData(value);
        getUser(value, idcourse.idcourse);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleSubmitWork = async () => {
        setStatusUpdate(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/extrapoint/getextra`,
                { idc, idTeach, point, inputData },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                    }
                })
            setDataAlert("ลงคะแนนพิเศษสำเร็จ !")
            setOpen(true);
            setStatusUpdate(false);
            setInputData("");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.message);
            } else {
                console.log('An unexpected error occurred');
            }
        }

    }

    return (
        <div>
            <ModalBody>
                <form className={`flex flex-col gap-4 ${kanit.className}`}>
                    <Autocomplete
                        defaultItems={dataUser}
                        inputProps={{
                            classNames: {
                                input: "ml-1",
                                inputWrapper: "h-[48px]",
                            },
                        }}
                        listboxProps={{
                            hideSelectedIcon: true,
                            itemClasses: {
                                base: [

                                    "text-default-500",
                                    "transition-opacity",
                                    "data-[hover=true]:text-foreground",
                                    "dark:data-[hover=true]:bg-default-50",
                                    "data-[pressed=true]:opacity-70",
                                    "data-[hover=true]:bg-default-200",
                                    "data-[selectable=true]:focus:bg-default-100",
                                    "data-[focus-visible=true]:ring-default-500",
                                ],
                            },
                        }}
                        aria-label="Select an employee"
                        placeholder="กรุณากรอกรหัสนักศึกษา"
                        description="สามารถกรอกรหัสนักศึกษา 4 ตัวท้ายได้ เช่น 334-8"
                        popoverProps={{
                            offset: 5,
                            classNames: {
                                base: "rounded-large",
                                content: "p-1 border-small border-default-100 bg-background",
                            },
                        }}
                        startContent={<SearchIcon className="text-default-400" strokeWidth={2.5} size={20} width={15} height={15} />}
                        onInputChange={onInputChange}
                        variant="bordered"
                        isRequired
                    >
                        {(item) => (
                            <AutocompleteItem key={item.name} textValue={item.stdid} className={kanit.className}>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2 items-center">
                                        <Avatar alt={item.stdid} className="flex-shrink-0" size="sm" src={item.image} />
                                        <div className="flex flex-col">
                                            <span className="text-small">{item.name}</span>
                                            <span className="text-tiny text-default-400">{item.stdid}</span>
                                        </div>
                                    </div>
                                    <Button
                                        className="border-small mr-0.5 font-medium shadow-small"
                                        radius="full"
                                        size="sm"
                                        variant="bordered"
                                    >
                                        เลือก
                                    </Button>
                                </div>
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                </form>
            </ModalBody>
            <ModalFooter>

                <Button className={`bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg ${statusUpdate ? 'opacity-50 cursor-not-allowed' : ''} `} isDisabled={inputData.length === 0 ? true : false}  onClick={handleSubmitWork}>
                    {statusUpdate ? (<><Spinner color="default"/> <p> กำลังบันทึก...</p></>) : "บันทึก"}
                </Button>

            </ModalFooter>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                    className={kanit.className}
                >
                    <p className={kanit.className}>{dataAlert}</p>
                </Alert>
            </Snackbar>
        </div>


    )
}
